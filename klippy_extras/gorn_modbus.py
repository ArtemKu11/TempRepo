import logging
from pymodbus.client.sync import ModbusSerialClient
from pymodbus.exceptions import ModbusIOException

GORN_POWER_REFRESH_TIME = 0.5


class GornModbus:
    def __init__(self, config):
        self.serial = '/dev/serial/by-id/usb-Silicon_Labs_CP2102N_USB_to_UART_Bridge_Controller_04106C7-if00-port0'
        self.client = ModbusSerialClient(
            method='rtu'
            , port=self.serial
            , baudrate=19200
            , parity='E'
            , timeout=1
        )
        self.connection = self.client.connect()

        self.refresh_time = GORN_POWER_REFRESH_TIME
        self.printer = config.get_printer()
        self.gcode = self.printer.lookup_object('gcode')
        self.reactor = self.printer.get_reactor()
        self.unit_timers = {
            1: self.reactor.register_timer(self.__refresh_power_unit_1),
            2: self.reactor.register_timer(self.__refresh_power_unit_2)
        }
        # self.timer = self.reactor.register_timer(self.__refresh_power)
        self.is_time_active = False

        self.gcode.register_command('GORN_ON',
                                    self.cmd_GORN_ON,
                                    desc=self.cmd_GORN_ON_help)
        self.gcode.register_command('GORN_OFF',
                                    self.cmd_GORN_OFF,
                                    desc=self.cmd_GORN_OFF_help)
        self.gcode.register_command('SET_WELD_PARAMETERS',
                                    self.cmd_SET_WELD_PARAMETERS,
                                    desc=self.cmd_SET_WELD_PARAMETERS_help)

        self.gcode.register_command('SET_NEW_UNIT_ADDRESS',
                                    self.cmd_SET_NEW_UNIT_ADDRESS,
                                    desc=self.cmd_SET_NEW_UNIT_ADDRESS_help)

        self.printer.register_event_handler("klippy:shutdown", self._handle_shutdown)
        self.printer.register_event_handler("klippy:connect",
                                            self._handle_connect)
        self.printer.register_event_handler("klippy:disconnect", self._handle_disconnect)

        self.printer.register_event_handler("gcode:request_restart",
                                            self._handle_request_restart)

    def get_status(self, eventtime):
        return {
            'unit_1': self.__get_unit_1_state(),
            'unit_2': self.__get_unit_2_state()
        }

    def __get_unit_2_state(self):
        try:
            voltage_divider = self.__get_voltage_divider(2)
            current_divider = self.__get_current_divider(2)
            state = self.__get_state(2)
            if state == 'error':
                raise IOError()
            voltage_max = self.__get_voltage_max(2) / voltage_divider
            current_max = self.__get_current_max(2) / current_divider
            voltage_setting = self.__get_voltage_setting(2) / voltage_divider
            current_setting = self.__get_current_setting(2) / current_divider
            voltage_fact = self.__get_voltage_fact(2) / voltage_divider
            current_fact = self.__get_current_fact(2) / current_divider
        except Exception as e:
            state = 'unknown'
            voltage_max = 150
            current_max = 20
            voltage_setting = 0
            current_setting = 0
            voltage_fact = 0
            current_fact = 0
            pass
        return {
            'state': state,
            'voltage_max': voltage_max,
            'current_max': current_max,
            'voltage_setting': voltage_setting,
            'current_setting': current_setting,
            'voltage_fact': voltage_fact,
            'current_fact': current_fact,
            'unit': 2
        }

    def __get_unit_1_state(self):
        try:
            voltage_divider = self.__get_voltage_divider(1)
            current_divider = self.__get_current_divider(1)
            state = self.__get_state(1)
            if state == 'error':
                raise IOError()
            voltage_max = self.__get_voltage_max(1) / voltage_divider
            current_max = self.__get_current_max(1) / current_divider
            voltage_setting = self.__get_voltage_setting(1) / voltage_divider
            current_setting = self.__get_current_setting(1) / current_divider
            voltage_fact = self.__get_voltage_fact(1) / voltage_divider
            current_fact = self.__get_current_fact(1) / current_divider
        except Exception as e:
            state = 'unknown'
            voltage_max = 40
            current_max = 190
            voltage_setting = 0
            current_setting = 0
            voltage_fact = 0
            current_fact = 0
            pass
        return {
            'state': state,
            'voltage_max': voltage_max,
            'current_max': current_max,
            'voltage_setting': voltage_setting,
            'current_setting': current_setting,
            'voltage_fact': voltage_fact,
            'current_fact': current_fact,
            'unit': 1
        }

    def __get_current_divider(self, unit: int):
        point_position = self.__get_current_point_position(unit)
        return 10**point_position

    def __get_voltage_divider(self, unit: int):
        point_position = self.__get_voltage_point_position(unit)
        return 10**point_position

    def __get_current_point_position(self, unit: int):
        registers = self.client.read_input_registers(4, 1, unit=unit)
        if type(registers) == ModbusIOException:
            raise registers
        if not (len(registers.registers) and type(registers.registers[0]) == int):
            raise IOError('Не удалось прочитать значение регистра')
        return registers.registers[0]

    def __get_voltage_point_position(self, unit: int):
        registers = self.client.read_input_registers(5, 1, unit=unit)
        if type(registers) == ModbusIOException:
            raise registers
        if not (len(registers.registers) and type(registers.registers[0]) == int):
            raise IOError('Не удалось прочитать значение регистра')
        return registers.registers[0]

    def __get_current_max(self, unit: int):
        registers = self.client.read_input_registers(6, 1, unit=unit)
        if type(registers) == ModbusIOException:
            raise registers
        if not (len(registers.registers) and type(registers.registers[0]) == int):
            raise IOError('Не удалось прочитать значение регистра')
        return registers.registers[0]
        # current = 190
        # if len(registers.registers):
        #     current = registers.registers[0]
        # return current

    def __get_voltage_max(self, unit: int):
        registers = self.client.read_input_registers(7, 1, unit=unit)
        if type(registers) == ModbusIOException:
            raise registers
        if not (len(registers.registers) and type(registers.registers[0]) == int):
            raise IOError('Не удалось прочитать значение регистра')
        return registers.registers[0]
        # voltage = 40
        # if len(registers.registers):
        #     voltage = registers.registers[0] / 10
        # return voltage

    def __get_voltage_setting(self, unit: int):
        registers = self.client.read_holding_registers(19, 1, unit=unit)
        if type(registers) == ModbusIOException:
            raise registers
        if not (len(registers.registers) and type(registers.registers[0]) == int):
            raise IOError('Не удалось прочитать значение регистра')
        return registers.registers[0]
        # voltage = 0
        # if len(registers.registers):
        #     voltage = registers.registers[0] / 10
        # return voltage

    def __get_current_setting(self, unit: int):
        registers = self.client.read_holding_registers(18, 1, unit=unit)
        if type(registers) == ModbusIOException:
            raise registers
        if not (len(registers.registers) and type(registers.registers[0]) == int):
            raise IOError('Не удалось прочитать значение регистра')
        return registers.registers[0]
        # current = 0
        # if len(registers.registers):
        #     current = registers.registers[0]
        # return current

    def __get_voltage_fact(self, unit: int):
        registers = self.client.read_input_registers(21, 1, unit=unit)
        if type(registers) == ModbusIOException:
            raise registers
        if not (len(registers.registers) and type(registers.registers[0]) == int):
            raise IOError('Не удалось прочитать значение регистра')
        return registers.registers[0]
        # voltage = 0
        # if len(registers.registers):
        #     voltage = registers.registers[0] / 10
        # return voltage

    def __get_current_fact(self, unit: int):
        registers = self.client.read_input_registers(20, 1, unit=unit)
        if type(registers) == ModbusIOException:
            raise registers
        if not (len(registers.registers) and type(registers.registers[0]) == int):
            raise IOError('Не удалось прочитать значение регистра')
        return registers.registers[0]
        # current = 0
        # if len(registers.registers):
        #     current = registers.registers[0]
        # return current

    def __get_state(self, unit: int):
        res = self.client.read_coils(272, 2, unit=unit)
        if type(res) == ModbusIOException:
            return 'error'
        bits = res.bits
        master_power = bits[0]
        output_current = bits[1]
        if master_power and output_current:
            return 'on'
        elif master_power and not output_current:
            return 'master_power'
        elif not master_power and output_current:
            return 'output_current'
        else:
            return 'off'

    def __raw_set_voltage(self, voltage: int, unit: int):
        res = self.client.write_register(19, voltage, unit=unit)
        if type(res) == ModbusIOException:
            raise res

    def __raw_set_current(self, current: int, unit: int):
        res = self.client.write_register(18, current, unit=unit)
        if type(res) == ModbusIOException:
            raise res

    def __set_voltage(self, voltage: str, unit: int):
        if voltage.isdigit():
            voltage = int(voltage)
            voltage_divider = self.__get_voltage_divider(unit)
            if voltage <= self.__get_voltage_max(unit) / voltage_divider:
                voltage = voltage * voltage_divider
                self.__raw_set_voltage(voltage, unit)
            else:
                raise ValueError('Значение напряжения больше допустимого')
        else:
            raise ValueError('Значение напряжения не число')

    def __set_current(self, new_current: str, unit: int):
        if new_current.isdigit():
            new_current = int(new_current)
            current_divider = self.__get_current_divider(unit)
            if new_current <= self.__get_current_max(unit) / current_divider:
                new_current = new_current * current_divider
                self.__raw_set_current(new_current, unit)
            else:
                raise ValueError('Значение тока больше допустимого')
        else:
            raise ValueError('Значение тока не число')

    def __set_new_unit_address(self, unit: int, new_unit: int):
        logging.info(f'Для устройства с unit={unit} установлен новый unit={new_unit}')
        res = self.client.write_register(32, new_unit, unit=unit)
        if type(res) == ModbusIOException:
            raise res

    cmd_SET_NEW_UNIT_ADDRESS_help = 'Установить новый сетевой адрес'
    def cmd_SET_NEW_UNIT_ADDRESS(self, gcmd):
        try:
            command_params = gcmd.get_command_parameters()
            unit = self.__get_unit(command_params)
            new_unit = self.__get_new_unit(command_params)
            self.__set_new_unit_address(unit, new_unit)
        except Exception as e:
            raise gcmd.error(e.__str__())

    cmd_SET_WELD_PARAMETERS_help = 'Установить напряжение и ток'
    def cmd_SET_WELD_PARAMETERS(self, gcmd):
        cmd_params = gcmd.get_command_parameters()
        try:
            command_params = gcmd.get_command_parameters()
            unit = self.__get_unit(command_params)

            if 'VOLTAGE' in cmd_params.keys():
                new_voltage = cmd_params['VOLTAGE'].strip()
                self.__set_voltage(new_voltage, unit)

            if 'CURRENT' in cmd_params.keys():
                new_current = cmd_params['CURRENT'].strip()
                self.__set_current(new_current, unit)

        except Exception as e:
            raise gcmd.error(e.__str__())

    def __get_new_unit(self, command_params):
        if 'NEW_UNIT' not in command_params:
            raise ValueError('Необходимо указать new_unit устройства')
        new_unit = command_params['NEW_UNIT'].strip()
        if new_unit.isdigit():
            new_unit = int(new_unit)
        else:
            raise ValueError('Некорректный new_unit устройства')
        if new_unit not in self.unit_timers.keys():
            raise ValueError('Некорректный new_unit устройства')
        return new_unit

    cmd_GORN_ON_help = 'Включить сварочник'
    def cmd_GORN_ON(self, gcmd):
        try:
            command_params = gcmd.get_command_parameters()
            unit = self.__get_unit(command_params)
            power_timer = self.unit_timers.get(unit)
            res = self.client.write_coil(272, True, unit=unit)
            if type(res) == ModbusIOException:
                raise res
            self.reactor.update_timer(power_timer, self.reactor.NOW)
        except Exception as e:
            raise gcmd.error(e.__str__())

    def __get_unit(self, command_params):
        if 'UNIT' not in command_params:
            raise ValueError('Необходимо указать unit устройства')
        unit = command_params['UNIT'].strip()
        if unit.isdigit():
            unit = int(unit)
        else:
            raise ValueError('Некорректный unit устройства')
        if unit not in self.unit_timers.keys():
            raise ValueError('Некорректный unit устройства')
        return unit

    cmd_GORN_OFF_help = 'Выключить сварочник'
    def cmd_GORN_OFF(self, gcmd):
        try:
            command_params = gcmd.get_command_parameters()
            unit = self.__get_unit(command_params)

            power_timer = self.unit_timers.get(unit)
            self.reactor.update_timer(power_timer, self.reactor.NEVER)
            res = self.client.write_coil(273, False, unit=unit)
            res2 = self.client.write_coil(272, False, unit=unit)
            if type(res) == ModbusIOException:
                raise res

            if type(res2) == ModbusIOException:
                raise res

        except Exception as e:
            raise gcmd.error(e.__str__())


    def __refresh_power_unit_1(self, eventtime):
        try:
            res = self.client.read_coils(272, 1, unit=1)
            bits = res.bits
            master_power = bits[0]
            if master_power:
                self.client.write_coil(273, True, unit=1)
        except Exception as e:
            pass
            # raise self.gcode.error(e.__str__())
        measured_time = self.reactor.monotonic()
        return measured_time + self.refresh_time

        # logging.info('TIMER FUNC')
        # self.gcode.respond_info('Hello', log=False)
        # measured_time = self.reactor.monotonic()
        # return measured_time + self.refresh_time

    def __refresh_power_unit_2(self, eventtime):
        try:
            res = self.client.read_coils(272, 1, unit=2)
            bits = res.bits
            master_power = bits[0]
            if master_power:
                self.client.write_coil(273, True, unit=2)
        except Exception as e:
            pass
            # raise self.gcode.error(e.__str__())
        measured_time = self.reactor.monotonic()
        return measured_time + self.refresh_time

    def _handle_disconnect(self):
        for unit, timer in self.unit_timers.items():
            self.reactor.update_timer(timer, self.reactor.NEVER)
            self.client.write_coil(273, False, unit=unit)
            self.client.write_coil(272, False, unit=unit)

    def _handle_request_restart(self, print_time):
        return

    def _handle_shutdown(self):
        for unit, timer in self.unit_timers.items():
            self.reactor.update_timer(timer, self.reactor.NEVER)
            self.client.write_coil(273, False, unit=unit)
            self.client.write_coil(272, False, unit=unit)
        return

    def _handle_connect(self):
        # self.reactor.update_timer(self.timer, self.reactor.NOW)
        return


def load_config(config):
    return GornModbus(config)

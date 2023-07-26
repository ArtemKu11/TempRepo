import pymodbus
from pymodbus.pdu import ModbusRequest
from pymodbus.client import ModbusSerialClient
from pymodbus.transaction import ModbusRtuFramer
from time import sleep

class GornModbus:
    def __init__(self):
        # self.serial = '/dev/serial/by-id/usb-Silicon_Labs_CP2102N_USB_to_UART_Bridge_Controller_04106C7-if00-port0'
        self.client = ModbusSerialClient(
            method='rtu'
            , port='/dev/serial/by-id/usb-Silicon_Labs_CP2102N_USB_to_UART_Bridge_Controller_04106C7-if00-port0'
            , baudrate=19200
            , parity='E'
            , timeout=1
        )
        self.connection = self.client.connect()
        # print(self.client.connected)

        self.__print_ustavka()
        self.__print_pitanie()
        print("Включаю питание...")
        self.client.write_coil(272, True, 1)
        print('Питание включено')
        print("Включаю выходной ток...")
        while True:
            self.client.write_coil(273, True, 1)
            sleep(0.5)
            self.__print_pitanie()
            self.__print_ustavka()
            self.__print_tok_i_napruga()

    def __set_voltage_setting(self, voltage: int):
        print(f'Записываю уставку напряжения: {voltage}')
        self.client.write_register(19, voltage, 1)

    def __print_ustavka(self):
        registers = self.client.read_holding_registers(18, 2, 1)
        print(f'Уставка тока и напряжения: {registers.registers}')

    def __print_pitanie(self):
        power_registers = self.client.read_coils(272, 2, 1)
        print(f'Регистры питания: {power_registers.bits}')

    def __print_tok_i_napruga(self):
        registers = self.client.read_input_registers(20, 2, 1)
        print(f'Измеренный ток и напряжение: {registers.registers}')

    def __del__(self):
        self.client.write_coil(273, False, 1)
        self.client.write_coil(272, False, 1)
        self.client.close()


if __name__ == '__main__':
    GornModbus()

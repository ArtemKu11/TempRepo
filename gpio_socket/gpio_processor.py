import asyncio

import wiringpi
from button_event import ButtonEvent


class Button:
    pin: int
    button_number: int
    is_key_down: bool

    def __init__(self):
        self.is_key_down = False


class OPGpioProcessor:
    def __init__(self, send_to_clients_callback, clients_list):
        self.send_to_clients_callback = send_to_clients_callback
        self.clients_list = clients_list
        self.buttons = []
        buttons_conf = open('/home/orangepi/gpio_tests/gpio_socket/buttons.yaml', 'r')
        self.__parse_config(buttons_conf)
        buttons_conf.close()

    async def start_processing(self):
        if len(self.buttons):
            self.__set_pin_mode()
            await self.__listen_pins()

    async def __listen_pins(self):
        while True:
            if not len(self.clients_list):
                await asyncio.sleep(1)
                continue
            else:
                await asyncio.sleep(0.01)

            for btn in self.buttons:
                result = wiringpi.digitalRead(btn.pin)
                if result:
                    if not btn.is_key_down:
                        btn.is_key_down = True
                        key_down_event = ButtonEvent(button_number=btn.button_number, event_type='key_down')
                        await self.send_to_clients_callback(key_down_event.__dict__)
                else:
                    if btn.is_key_down:
                        btn.is_key_down = False
                        key_up_event = ButtonEvent(button_number=btn.button_number, event_type='key_up')
                        await self.send_to_clients_callback(key_up_event.__dict__)

    def __set_pin_mode(self):  # IN
        for btn in self.buttons:
            wiringpi.pinMode(btn.pin, 0)

    def __parse_config(self, buttons_conf):
        processing_button = Button()
        first_button_flag = True
        for line in buttons_conf:
            if line.startswith('button'):
                if first_button_flag:
                    first_button_flag = False
                    continue
                self.buttons.append(processing_button)
                processing_button = Button()
                continue
            if line.count('number'):
                processing_button.button_number = self.__get_number_after_points(line)
            elif line.count('pin'):
                processing_button.pin = self.__get_number_after_points(line)
        self.buttons.append(processing_button)

    def __get_number_after_points(self, line: str):
        line = line.strip()
        points = line.index(":")
        return int(line[points + 2:])

import asyncio

import wiringpi
from dto import ButtonEvent, EncoderEvent


class Button:
    pin: int
    button_number: int
    is_key_down: bool

    def __init__(self):
        self.is_key_down = False

    def __repr__(self):
        return f"Button with button_number = {self.button_number}, pin = {self.pin}"


class Encoder:
    first_pin: int
    second_pin: int
    encoder_number: int

    def __init__(self):
        self.first_pin_value = None
        self.second_pin_value = None

    def __repr__(self):
        return f'Encoder with encoder_number = {self.encoder_number}, first_pin = {self.first_pin}, second_pin = {self.second_pin}'


class OPGpioProcessor:

    # def __init__(self):
    #     self.buttons = []
    #     self.encoders = []
    #     gpio_config = open('gpio_config.yaml', 'r')
    #     self.__parse_config(gpio_config)
    #     gpio_config.close()

    def __init__(self, send_to_clients_callback, clients_list):
        self.send_to_clients_callback = send_to_clients_callback
        self.clients_list = clients_list
        self.buttons = []
        self.encoders = []
        gpio_config = open('/home/orangepi/gpio_tests/gpio_socket/gpio_config.yaml', 'r')
        self.__parse_config(gpio_config)
        gpio_config.close()

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
                state = self.__get_button_state(btn)
                if state == 'key_down':
                    key_down_event = ButtonEvent(button_number=btn.button_number, event_type='key_down')
                    await self.send_to_clients_callback(key_down_event.__dict__)
                elif state == 'key_up':
                    key_up_event = ButtonEvent(button_number=btn.button_number, event_type='key_up')
                    await self.send_to_clients_callback(key_up_event.__dict__)

            for encoder in self.encoders:
                state = self.__get_encoder_state(encoder)
                if state == 'clockwise':
                    clockwise_encoder_event = EncoderEvent(encoder_number=encoder.encoder_number, rotation='clockwise')
                    await self.send_to_clients_callback(clockwise_encoder_event.__dict__)
                elif state == 'counter_clockwise':
                    counter_clockwise_encoder_event = EncoderEvent(encoder_number=encoder.encoder_number,
                                                                   rotation='counter_clockwise')
                    await self.send_to_clients_callback(counter_clockwise_encoder_event.__dict__)

    # ПО ЧАСОВОЙ:
    # 1 1
    # 1 0
    # 0 0
    # 0 1
    # 1 1

    # ПРОТИВ ЧАСОВОЙ:
    # 1 1
    # 0 1
    # 0 0
    # 1 0
    # 1 1
    def __get_encoder_state(self, encoder: Encoder):
        first_value = wiringpi.digitalRead(encoder.first_pin)
        second_value = wiringpi.digitalRead(encoder.second_pin)
        state = 'None'
        if encoder.first_pin_value is None or encoder.second_pin_value is None:
            self.__refresh_encoder(encoder, first_value, second_value)
            return state

        if first_value == 1 and second_value == 1 and encoder.first_pin_value == 1 and encoder.second_pin_value == 0:
            state = 'clockwise'
        elif first_value == 1 and second_value == 1 and encoder.first_pin_value == 0 and encoder.second_pin_value == 1:
            state = 'counter_clockwise'

        self.__refresh_encoder(encoder, first_value, second_value)
        return state

    def __refresh_encoder(self, encoder: Encoder, first_value, second_value):
        encoder.first_pin_value = first_value
        encoder.second_pin_value = second_value

    def __get_button_state(self, btn: Button):
        result = wiringpi.digitalRead(btn.pin)
        if result:
            if not btn.is_key_down:
                btn.is_key_down = True
                return 'key_down'
        else:
            if btn.is_key_down:
                btn.is_key_down = False
                return 'key_up'
        return 'None'

    def __check_encoder_satisfaction(self, encoder: Encoder):
        return encoder is not None and hasattr(encoder, 'first_pin') and hasattr(encoder, 'second_pin') and hasattr(
            encoder, 'encoder_number')

    def __check_button_satisfaction(self, button: Button):
        return button is not None and hasattr(button, 'pin') and hasattr(button, 'button_number')

    def __set_pin_mode(self):  # 1-OUT (Когда хотим вводить), 0-IN (Когда хотим слушать)
        for btn in self.buttons:
            wiringpi.pinMode(btn.pin, 0)
        for encoder in self.encoders:
            wiringpi.pinMode(encoder.first_pin, 0)
            wiringpi.pinMode(encoder.second_pin, 0)

    def __parse_config(self, gpio_config):
        processing_button = None
        processing_encoder = None
        for line in gpio_config:

            if line.startswith('button') or line.startswith('encoder'):
                if self.__check_encoder_satisfaction(processing_encoder):
                    self.encoders.append(processing_encoder)
                if self.__check_button_satisfaction(processing_button):
                    self.buttons.append(processing_button)
                processing_encoder = None
                processing_button = None
                if line.startswith('button'):
                    processing_button = Button()
                elif line.startswith('encoder'):
                    processing_encoder = Encoder()
                continue

            if line.count('number'):
                if processing_button is not None:
                    processing_button.button_number = self.__get_number_after_points(line)
                elif processing_encoder is not None:
                    processing_encoder.encoder_number = self.__get_number_after_points(line)
            elif line.count('first_pin'):
                if processing_encoder is not None:
                    processing_encoder.first_pin = self.__get_number_after_points(line)
            elif line.count('second_pin'):
                if processing_encoder is not None:
                    processing_encoder.second_pin = self.__get_number_after_points(line)
            elif line.count('pin'):
                if processing_button is not None:
                    processing_button.pin = self.__get_number_after_points(line)

        if self.__check_button_satisfaction(processing_button):
            self.buttons.append(processing_button)
        if self.__check_encoder_satisfaction(processing_encoder):
            self.encoders.append(processing_encoder)

    def __get_number_after_points(self, line: str):
        line = line.strip()
        points = line.index(":")
        return int(line[points + 2:])

# if __name__ == '__main__':
#     processor = OPGpioProcessor()
#     print(processor.buttons, processor.encoders)

import asyncio

import wiringpi
from dto import Button, Encoder, EncoderEvent, ButtonEvent
from queue import Queue
import time


class GornControllerGPIO:
    def __init__(self, send_to_clients_callback, clients_list, event_loop, events_queue: Queue):
        self.send_to_clients_callback = send_to_clients_callback
        self.clients_list = clients_list
        self.event_loop = event_loop
        self.events_queue = events_queue
        self.buttons = []
        self.encoders = []
        gpio_config = open('/home/orangepi/dev/interface/gpio_socket/gpio_config.yaml', 'r')
        # gpio_config = open('/home/pi/gpio/gpio_socket/gpio_config.yaml', 'r')
        self.__parse_config(gpio_config)
        gpio_config.close()

    async def start_processing(self):
        if len(self.buttons) or len(self.encoders):
            self.__set_pin_mode()
            await self.__listen_pins()

    async def __listen_pins(self):
        print(f'[ INFO ] СЛУШАЕТСЯ: {len(self.buttons)} КНОПОК, {len(self.encoders)} ЭНКОДЕРОВ')
        while True:
            if not len(self.clients_list):
                await asyncio.sleep(1)
                continue
            for encoder in self.encoders:
                result = self.__listen_encoder(encoder)
                if result in ['clockwise', 'counter_clockwise']:
                    self.__emit_encoder(encoder, result)
            for button in self.buttons:
                result = self.__listen_button(button)
                if result == 'emit':
                    self.__emit_button(button)
            await asyncio.sleep(0.01)

    def __emit_encoder(self, encoder: Encoder, direction: str):
        encoder_event = EncoderEvent(encoder_number=encoder.encoder_number, rotation=direction).__dict__
        self.events_queue.put(encoder_event, block=True)

    def __emit_button(self, button: Button):
        emit_button_event = ButtonEvent(button_number=button.button_number, event_type='both').__dict__
        self.events_queue.put(emit_button_event, block=True)

    def __listen_encoder(self, encoder: Encoder):  # хз как это работает, но работает))) А вообще надо переделать
        last_first_pin_value = wiringpi.digitalRead(encoder.first_pin)
        last_second_pin_value = wiringpi.digitalRead(encoder.second_pin)
        # start_time_ms = int(time.time() * 1000)
        # counter = 0
        while not (last_first_pin_value == 1 and last_second_pin_value == 1):

            current_first_pin_value = wiringpi.digitalRead(encoder.first_pin)
            current_second_pin_value = wiringpi.digitalRead(encoder.second_pin)
            if last_first_pin_value == 0 and last_second_pin_value == 1 and current_first_pin_value == 1 and current_second_pin_value == 1:
                return 'clockwise'
            elif last_first_pin_value == 1 and last_second_pin_value == 0 and current_first_pin_value == 1 and current_second_pin_value == 1:
                return 'counter_clockwise'
            last_first_pin_value = current_first_pin_value
            last_second_pin_value = current_second_pin_value

            # counter += 1
            # if counter == 100:
            #     time_ms = int(time.time() * 1000)
            #     if time_ms - start_time_ms > 100:
            #         return 'None'
            # current_first_pin_value = wiringpi.digitalRead(encoder.first_pin)
            # current_second_pin_value = wiringpi.digitalRead(encoder.second_pin)
            # if current_first_pin_value != last_first_pin_value or current_second_pin_value != last_second_pin_value:
            #     if current_first_pin_value == 1 and current_second_pin_value == 0:
            #         return 'clockwise'
            #     elif current_first_pin_value == 0 and current_second_pin_value == 1:
            #         return 'counter_clockwise'
            #     else:
            #         return 'None'
            # else:
            #     last_first_pin_value = current_first_pin_value
            #     last_second_pin_value = current_second_pin_value

    def __listen_button(self, button: Button):
        if button.button_number in [2, 3]:
            return self.__listen_encoder_button(button)
        elif button.button_number in [1]:
            return self.__listen_puddown_button(button)

    def __listen_puddown_button(self, button: Button):  # 0 по дефолту
        if button.last_event_time is None:
            button.last_event_time = int(time.time() * 1000)
        last_value = wiringpi.digitalRead(button.pin)
        if last_value == 1:
            key_down_millisec = int(time.time() * 1000)
            if key_down_millisec - button.last_event_time < 200:
                return 'None'
            while last_value != 0:
                last_value = wiringpi.digitalRead(button.pin)
            key_up_millisec = int(time.time() * 1000)
            if key_up_millisec - key_down_millisec > 50:
                button.last_event_time = key_up_millisec
                return 'emit'
        return 'None'

    def __listen_encoder_button(self, button: Button):  # 1 по дефолту
        if button.last_event_time is None:
            button.last_event_time = int(time.time() * 1000)
        last_value = wiringpi.digitalRead(button.pin)
        if last_value == 0:
            key_down_millisec = int(time.time() * 1000)
            if key_down_millisec - button.last_event_time < 100:
                return 'None'
            while last_value != 1:
                last_value = wiringpi.digitalRead(button.pin)
            key_up_millisec = int(time.time() * 1000)
            if key_up_millisec - key_down_millisec > 50:
                button.last_event_time = key_up_millisec
                return 'emit'
        return 'None'

    def __set_pin_mode(self):
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

    def __check_encoder_satisfaction(self, encoder: Encoder):
        return encoder is not None and hasattr(encoder, 'first_pin') and hasattr(encoder, 'second_pin') and hasattr(
            encoder, 'encoder_number')

    def __check_button_satisfaction(self, button: Button):
        return button is not None and hasattr(button, 'pin') and hasattr(button, 'button_number')

# if __name__ == '__main__':
# GornControllerGPIO()

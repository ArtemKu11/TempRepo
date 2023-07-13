import asyncio
from queue import Queue

import RPi.GPIO as GPIO
from dto import Button, Encoder, EncoderEvent, ButtonEvent
import time


class RPiGpioProcessor:

    # def __init__(self):
    #     self.buttons = []
    #     self.encoders = []
    #     gpio_config = open('gpio_config.yaml', 'r')
    #     self.__parse_config(gpio_config)
    #     gpio_config.close()

    def __init__(self, send_to_clients_callback, clients_list, event_loop, events_queue: Queue):
        GPIO.setmode(GPIO.BOARD)
        self.send_to_clients_callback = send_to_clients_callback
        self.clients_list = clients_list
        self.event_loop = event_loop
        self.events_queue = events_queue
        self.buttons = []
        self.encoders = []
        gpio_config = open('/home/pi/gpio/gpio_socket/gpio_config.yaml', 'r')
        self.__parse_config(gpio_config)
        gpio_config.close()

    def __del__(self):
        GPIO.cleanup()

    async def start_processing(self):
        if len(self.buttons) or len(self.encoders):
            self.__set_pin_mode()
            await self.__listen_pins()

    async def __listen_pins(self):
        list_of_coros = []
        for button in self.buttons:
            list_of_coros.append(self.__listen_button(button))
        for encoder in self.encoders:
            list_of_coros.append(self.__listen_encoder(encoder))
            # list_of_coros.append(self.__listen_encoder_on_falling(encoder))
        await asyncio.gather(*list_of_coros)
        print(f'[ INFO ] СЛУШАЕТСЯ: {len(self.buttons)} КНОПОК, {len(self.encoders)} ЭНКОДЕРОВ')
        while True:
            await asyncio.sleep(1)

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

    async def __listen_encoder_on_falling(self, encoder: Encoder):
        GPIO.setup(encoder.first_pin, GPIO.IN)
        GPIO.setup(encoder.second_pin, GPIO.IN)
        GPIO.add_event_detect(encoder.first_pin, GPIO.RISING,
                              callback=lambda x: self.__encoder_first_pin_falling(encoder))
        GPIO.add_event_detect(encoder.second_pin, GPIO.RISING,
                              callback=lambda x: self.__encoder_second_pin_falling(encoder))

    def __encoder_first_pin_falling(self, encoder):
        print(encoder.encoder_number, 'FIRST_PIN')
        second_pin_value = GPIO.input(encoder.second_pin)
        if second_pin_value:
            encoder_event = EncoderEvent(encoder_number=encoder.encoder_number, rotation='counter_clockwise').__dict__
            self.events_queue.put(encoder_event)

    def __encoder_second_pin_falling(self, encoder):
        print(encoder.encoder_number, 'SECOND_PIN')
        first_pin_value = GPIO.input(encoder.first_pin)
        if first_pin_value:
            encoder_event = EncoderEvent(encoder_number=encoder.encoder_number, rotation='clockwise').__dict__
            self.events_queue.put(encoder_event)

    async def __listen_encoder(self, encoder: Encoder):
        # GPIO.setup(encoder.first_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        # GPIO.setup(encoder.second_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(encoder.first_pin, GPIO.IN)
        GPIO.setup(encoder.second_pin, GPIO.IN)
        GPIO.add_event_detect(encoder.first_pin, GPIO.RISING,
                              callback=lambda x: self.__encoder_first_pin_rising(encoder))
        GPIO.add_event_detect(encoder.second_pin, GPIO.RISING,
                              callback=lambda x: self.__encoder_second_pin_rising(encoder))

    def __encoder_first_pin_rising(self, encoder):
        print(encoder.encoder_number, 'FIRST_PIN')
        second_pin_value = GPIO.input(encoder.second_pin)
        if second_pin_value:
            encoder_event = EncoderEvent(encoder_number=encoder.encoder_number, rotation='clockwise').__dict__
            self.events_queue.put(encoder_event)

    def __encoder_second_pin_rising(self, encoder):
        print(encoder.encoder_number, 'SECOND_PIN')
        first_pin_value = GPIO.input(encoder.first_pin)
        if first_pin_value:
            encoder_event = EncoderEvent(encoder_number=encoder.encoder_number, rotation='counter_clockwise').__dict__
            self.events_queue.put(encoder_event)

    async def __listen_button(self, button: Button):
        GPIO.setup(button.pin, GPIO.IN)
        GPIO.add_event_detect(button.pin, GPIO.BOTH, callback=lambda x: self.interrupt_event(button))
        # while True:
        #     current_value = GPIO.input(button.pin)
        #     if current_value:
        #         # GPIO.wait_for_edge(button.pin, GPIO.FALLING)
        #         await asyncio.to_thread(GPIO.wait_for_edge, button.pin, GPIO.FALLING)
        #         key_up_event = ButtonEvent(button_number=button.button_number, event_type='key_up')
        #         await self.send_to_clients_callback(key_up_event.__dict__)
        #     else:
        #         # GPIO.wait_for_edge(button.pin, GPIO.RISING)
        #         await asyncio.to_thread(GPIO.wait_for_edge, button.pin, GPIO.RISING)
        #         key_down_event = ButtonEvent(button_number=button.button_number, event_type='key_down')
        #         await self.send_to_clients_callback(key_down_event.__dict__)

    def interrupt_event(self, button: Button):
        pin_value = GPIO.input(button.pin)
        if pin_value:
            self.key_down_event(button)
        else:
            self.key_up_event(button)
        # current_time = time.time()
        # if button.last_event_time is None or ((current_time - button.last_event_time) * 1000 > 50):
        #     if pin_value:
        #         self.key_down_event(button)
        #     else:
        #         self.key_up_event(button)
        #     button.last_event_time = current_time


    def key_down_event(self, button: Button):
        if not button.is_key_down:
            key_down_event = ButtonEvent(button_number=button.button_number, event_type='key_down').__dict__
            self.events_queue.put(key_down_event)
            # self.event_loop.create_task(self.send_to_clients_callback(key_down_event))

            # asyncio.ensure_future(self.send_to_clients_callback(key_down_event), loop=self.event_loop)
        button.is_key_down = True
        # GPIO.remove_event_detect(button.pin)
        # GPIO.add_event_detect(button.pin, GPIO.FALLING, callback=lambda x: self.key_up_event(button))
        # key_down_event = ButtonEvent(button_number=button.button_number, event_type='key_down')
        # await self.send_to_clients_callback(key_down_event.__dict__)


    def key_up_event(self, button: Button):
        if button.is_key_down:
            key_up_event = ButtonEvent(button_number=button.button_number, event_type='key_up').__dict__
            self.events_queue.put(key_up_event)
            # self.events_list.append(key_up_event)

            # asyncio.ensure_future(self.send_to_clients_callback(key_up_event), loop=self.event_loop)
            # self.event_loop.create_task(self.send_to_clients_callback(key_up_event))
        button.is_key_down = False
        # GPIO.remove_event_detect(button.pin)
        # GPIO.add_event_detect(button.pin, GPIO.RISING, callback=lambda x: self.key_down_event(button))

        # key_up_event = ButtonEvent(button_number=button.button_number, event_type='key_up')
        # await self.send_to_clients_callback(key_up_event.__dict__)


    def __set_pin_mode(self):  # 1-OUT (Когда хотим вводить), 0-IN (Когда хотим слушать)
        for btn in self.buttons:
            GPIO.setup(btn.pin, GPIO.IN)
        for encoder in self.encoders:
            GPIO.setup(encoder.first_pin, GPIO.IN)
            GPIO.setup(encoder.second_pin, GPIO.IN)


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

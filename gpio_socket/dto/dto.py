class Button:
    pin: int
    button_number: int
    is_key_down: bool
    last_event_time: int

    def __init__(self):
        self.is_key_down = False
        self.last_event_time = 0

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

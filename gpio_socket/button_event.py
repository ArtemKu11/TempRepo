class ButtonEvent:

    def __init__(self, button_number: int, event_type: str):
        self.event_type = 'button_event'
        self.type = event_type  # key_down / key_up
        self.button_number = button_number

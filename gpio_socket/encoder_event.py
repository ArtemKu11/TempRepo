class EncoderEvent:
    def __init__(self, encoder_number: int, rotation: str):
        self.event_type = 'encoder_event'
        self.type = rotation  # clockwise / counter_clockwise
        self.encoder_number = encoder_number

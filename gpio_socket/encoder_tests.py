import wiringpi

if __name__ == '__main__':
    wiringpi.wiringPiSetup()
    first_pin = 9
    second_pin = 10
    wiringpi.pinMode(first_pin, 0)
    wiringpi.pinMode(second_pin, 0)

    last_value_f = wiringpi.digitalRead(first_pin)
    last_value_s = wiringpi.digitalRead(second_pin)

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

    while True:
        last_value_f = wiringpi.digitalRead(first_pin)
        last_value_s = wiringpi.digitalRead(second_pin)
        while not (last_value_s == 1 and last_value_f == 1):
            value_f = wiringpi.digitalRead(first_pin)
            value_s = wiringpi.digitalRead(second_pin)
            if last_value_f == 0 and last_value_s == 1 and value_f == 1 and value_s == 1:
                print('ПО ЧАСОВОЙ')
            elif last_value_f == 1 and last_value_s == 0 and value_f == 1 and value_s == 1:
                print('ПРОТИВ ЧАСОВОЙ')
            last_value_f = value_f
            last_value_s = value_s

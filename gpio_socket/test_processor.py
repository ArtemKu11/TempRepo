import asyncio
from dto import ButtonEvent
import datetime, time
from time import sleep

class TestProcessor:
    def __init__(self, send_to_clients_callback, clients_list):
        self.send_to_clients_callback = send_to_clients_callback
        self.clients_list = clients_list
        self.is_key_down = False

    async def start_processing(self):
        await self.blocking_io()
        # await asyncio.to_thread(await self.blocking_io())

    async def blocking_io(self):
        while True:
            if not len(self.clients_list):
                await asyncio.sleep(1)
                continue
            else:
                await asyncio.sleep(0.01)
            f = open('button_pin_mock', 'r')
            result = f.read(1)
            if result:
                result = int(result)
                if result:
                    if not self.is_key_down:
                        self.is_key_down = True
                        key_down_event = ButtonEvent(button_number=4, event_type='key_down')
                        await self.send_to_clients_callback(key_down_event.__dict__)
                        print('key_down')
                else:
                    if self.is_key_down:
                        self.is_key_down = False
                        key_up_event = ButtonEvent(button_number=4, event_type='key_up')
                        await self.send_to_clients_callback(key_up_event.__dict__)
                        print('key_up')


if __name__ == '__main__':
    date = time.time()
    print(date)
    sleep(1)
    print((time.time() - date) * 1000)

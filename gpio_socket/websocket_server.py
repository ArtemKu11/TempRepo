import asyncio
import json

from server_response import ServerResponse
from button_event import ButtonEvent

import websockets
from websockets.exceptions import ConnectionClosedOK


class WebSocketServer:
    clients_list = []
    loop: asyncio.AbstractEventLoop

    def __init__(self, loop):
        self.loop = loop

    async def start_server(self):
        serve_func = websockets.serve(self.new_client_connected, "localhost", 8125)
        input = self.input_func()
        await asyncio.gather(serve_func, input)

    async def input_func(self):
        while True:
            if len(self.clients_list):
                command = await asyncio.to_thread(input, 'Введите номер кнопки: ')
                if command.isdigit():
                    key_down_event = ButtonEvent(button_number=int(command), event_type='key_down')
                    await self.send_to_clients(key_down_event.__dict__)
                    await asyncio.sleep(0.5)
                    key_up_event = ButtonEvent(button_number=int(command), event_type='key_up')
                    await self.send_to_clients(key_up_event.__dict__)
            else:
                await asyncio.sleep(1)

    async def send_to_clients(self, button):
        if len(self.clients_list):
            for i in range(0, len(self.clients_list)):
                response = json.dumps(ServerResponse(button).__dict__)
                await self.clients_list[i].send(response)

    async def new_client_connected(self, client_socket, path):
        if self.clients_list.count(client_socket):
            return
        self.clients_list.append(client_socket)
        while True:
            try:
                message = await client_socket.recv()
                print(message)
            except ConnectionClosedOK:
                if self.clients_list.count(client_socket):
                    self.clients_list.remove(client_socket)
                break

    def stop_everything(self):
        for task in asyncio.all_tasks(self.loop):
            task.cancel()


if __name__ == '__main__':
    event_loop = asyncio.new_event_loop()
    server = WebSocketServer(event_loop)
    asyncio.set_event_loop(event_loop)
    try:
        event_loop.run_until_complete(server.start_server())
    except KeyboardInterrupt:
        server.stop_everything()

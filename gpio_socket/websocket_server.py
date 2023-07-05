import asyncio
import json
import wiringpi

from server_response import ServerResponse
# from test_processor import TestProcessor
from gpio_processor import OPGpioProcessor

import websockets
from websockets.exceptions import ConnectionClosedOK


class WebSocketServer:
    clients_list = []
    loop: asyncio.AbstractEventLoop

    def __init__(self, loop):
        self.loop = loop

    async def start_server(self):
        serve_func = websockets.serve(self.new_client_connected, "localhost", 8125)
        # gpio_processor = TestProcessor(self.send_to_clients, self.clients_list)
        gpio_processor = OPGpioProcessor(self.send_to_clients, self.clients_list)
        await asyncio.gather(serve_func, gpio_processor.start_processing())

    async def send_to_clients(self, result):
        if len(self.clients_list):
            for i in range(0, len(self.clients_list)):
                response = json.dumps(ServerResponse(result).__dict__)
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
    wiringpi.wiringPiSetup()
    event_loop = asyncio.new_event_loop()
    server = WebSocketServer(event_loop)
    asyncio.set_event_loop(event_loop)
    try:
        event_loop.run_until_complete(server.start_server())
    except KeyboardInterrupt:
        server.stop_everything()

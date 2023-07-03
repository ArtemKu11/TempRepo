class ServerResponse:
    def __init__(self, result):
        self.jsonrpc = '2.0'
        self.result = result

import { AuthState } from "./auth/types";
import { ConfigState } from "./config/types";
import { SocketState } from "./socket/types";
import { WaitState } from "./wait/types";

export interface FluiddExtensionState {
    auth: AuthState,
    wait: WaitState,
    config: ConfigState,
    socket: SocketState
}
import { ParseGcodeWorkerServerMessage } from "@/store/gcodePreview/types"
import parseGcode from "./parseGcode"

// export const ParseGcodeWorker = (): Worker => {
//     // const worker = new Worker('./parseGcode', { type: 'module' });
//     const worker = new Worker(new URL('@/workers/helloWorker', import.meta.url));


//     const sendProgress = (filePosition: number) => {
//         const message: ParseGcodeWorkerClientMessage = {
//             action: 'progress',
//             filePosition
//         }

//         worker.postMessage(message)
//     }

//     const sendResult = (moves: Move[], layers: Layer[], parts: Part[]) => {
//         const message: ParseGcodeWorkerClientMessage = {
//             action: 'result',
//             moves,
//             layers,
//             parts
//         }

//         worker.postMessage(message)
//     }

//     worker.onmessage = (e) => {
//         const data: ParseGcodeWorkerServerMessage = e.data
//         switch (data.action) {
//             case 'parse': {
//                 const { moves, layers, parts } = parseGcode(data.gcode, sendProgress)

//                 sendResult(moves, layers, parts)

//                 break
//             }
//         }
//     }

//     return worker;
// }


onmessage = (e) => {
    const data: ParseGcodeWorkerServerMessage = e.data
    switch (data.action) {
        case 'parse': {
            parseGcode(data.gcode)
            break
        }
    }
}
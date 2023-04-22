// Production:
import { encoding_for_model } from "@dqbd/tiktoken";

export default function encoder() {
    return encoding_for_model("gpt-3.5-turbo")
}

// Development:
// Dummy encoder to prevent unnecessary refreshes on hot reload
// export default function encoder() {
//     return { encode: (str: string) => str.split('') }
// }
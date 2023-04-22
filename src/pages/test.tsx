import { encoding_for_model } from "@dqbd/tiktoken";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("hello world");
  const tokens = encoding_for_model("gpt-3.5-turbo").encode(input).length;

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div>{tokens.toString()}</div>
    </div>
  );
}
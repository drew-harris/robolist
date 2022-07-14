import { useState } from "react";
import { specialMessage } from "types";

export default function Web() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount((prev) => prev + 1)}>increase</button>
      <br />
      {specialMessage}
    </div>
  );
}

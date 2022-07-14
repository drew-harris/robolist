import { Button } from "@mantine/core";
import { useState } from "react";

export default function Web() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount((prev) => prev + 1)}>increase</button>
      <br />
      <Button>Hello there</Button>
    </div>
  );
}

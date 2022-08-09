import { Box } from "@mantine/core";
import { trpc } from "../utils/trpc";

export default function TestTrpcPage() {
  const { data, status, error } = trpc.useQuery(["helloworld"]);
  return (
    <Box>
      {data ? data.greeting : null} now is

      {data ? data.date.toLocaleDateString() : null}
    </Box >
  )
}
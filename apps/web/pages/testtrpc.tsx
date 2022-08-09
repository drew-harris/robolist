import { Box, Title } from "@mantine/core";
import { trpc } from "../utils/trpc";

export default function TestTrpcPage() {
  const { data, status, error } = trpc.useQuery(["helloworld"]);
  return (
    <Box>
      <Title>Yoooo</Title>
      {data ? data.dogName : null} now is

      {data ? data.date.toLocaleDateString() : null}
    </Box >
  )
}
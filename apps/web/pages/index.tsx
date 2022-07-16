import { Box } from "@mantine/core";
import { getCookie } from "cookies-next";
import { NextPageContext } from "next";
import Link from "next/link";
import { getUserFromJWT } from "../utils";

export default function Web() {
  return (
    <>
      <Link href="/tasks">Tasks</Link>
      <Box
        sx={(theme) => ({
          marginBottom: 9999,
        })}
      >
        Test
      </Box>
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const jwt = getCookie("jwt", context);
  const user = getUserFromJWT(jwt?.toString());
  return {
    props: {}, // will be passed to the page component as props
  };
}

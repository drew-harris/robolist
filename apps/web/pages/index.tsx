import { Box, Container, Title } from "@mantine/core";
import { getCookie } from "cookies-next";
import { NextPageContext } from "next";
import Link from "next/link";
import { getUserFromJWT } from "../utils";

export default function Web() {
  return (
    <Container mt={89}>
      <Title>The Easiest Way To Get Things Done</Title>
    </Container>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const jwt = getCookie("jwt", context);
  const user = getUserFromJWT(jwt?.toString());
  return {
    props: {}, // will be passed to the page component as props
  };
}

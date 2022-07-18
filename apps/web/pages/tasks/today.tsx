import { Box, Container, Title } from "@mantine/core";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { getUserFromJWT } from "../../utils";

export default function Web() {
  return <Box>Today</Box>;
}

export function getServerSideProps(
  context: NextPageContext
): GetServerSidePropsResult<{}> {
  const jwt = getCookie("jwt", context);
  const user = getUserFromJWT(jwt?.toString());
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {}, // will be passed to the page component as props
  };
}

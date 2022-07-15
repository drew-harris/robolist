import { getCookie } from "cookies-next";
import { NextPageContext } from "next";
import Link from "next/link";
import { ColorSchemeToggle } from "../components/ColorSchemeToggle";
import { getUserFromJWT } from "../utils";

export default function Web() {
  return (
    <>
      <Link href="/tasks">Tasks</Link>
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const jwt = getCookie("jwt", context);
  const user = getUserFromJWT(jwt?.toString())
  return {
    props: {}, // will be passed to the page component as props
  }
}

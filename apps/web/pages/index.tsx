import Link from "next/link";
import { ColorSchemeToggle } from "../components/ColorSchemeToggle";

export default function Web() {
  return (
    <>
      <ColorSchemeToggle />
      <Link href="/dogs">Dogs</Link>
    </>
  );
}

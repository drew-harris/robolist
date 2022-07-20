import { Title } from "@mantine/core";
import Link from "next/link";
import { ComponentProps } from "react";

export default function Logo() {
  return (
    <Link href="/">
      <Title
        order={3}
        sx={(theme) => ({
          fontWeight: 700,
          letterSpacing: -1.3,
          cursor: "pointer",
        })}
      >
        robolist
      </Title>
    </Link>
  );
}

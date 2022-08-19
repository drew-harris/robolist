import { Text, TextProps } from "@mantine/core";
import Link from "next/link";

export default function Logo(props: TextProps) {
	return (
		<Link href="/">
			<Text
				size={props.size || 22}
				sx={(theme) => ({
					fontWeight: 700,
					letterSpacing: -1.3,
					cursor: "pointer",
				})}
				{...props}
			>
				robolist
			</Text>
		</Link>
	);
}

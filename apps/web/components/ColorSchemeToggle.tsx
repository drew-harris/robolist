import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { TbMoon, TbSun } from "react-icons/tb";

export function ColorSchemeToggle() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	return (
		<ActionIcon
			onClick={() => toggleColorScheme()}
			size="md"
			sx={(theme) => ({
				backgroundColor:
					theme.colorScheme === "dark"
						? theme.colors.dark[6]
						: theme.colors.gray[0],
				color:
					theme.colorScheme === "dark"
						? theme.colors.yellow[4]
						: theme.colors.blue[6],
			})}
		>
			{colorScheme === "dark" ? <TbSun size={20} /> : <TbMoon size={20} />}
		</ActionIcon>
	);
}

import { ActionIcon, Tooltip } from "@mantine/core";
import CanvasLogo from "./CanvasLogo";

export default function OpenOnCanvasButton({ url }: { url: string }) {
	return (
		<Tooltip label="Open on Canvas">
			<a rel="noreferrer" href={url} target="_blank">
				<ActionIcon component="a">
					<CanvasLogo size={16} />
				</ActionIcon>
			</a>
		</Tooltip>
	);
}

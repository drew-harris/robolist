import {
	ActionIcon,
	Badge,
	Group,
	Paper,
	Stack,
	Sx,
	Text,
	Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Rotate360 } from "tabler-icons-react";
import { TDemoTask } from "types";

type TaskProps = TaskOptionProps & {
	task: TDemoTask;
};

export interface TaskOptionProps {
	checkbox?: boolean;
	workdayLabel?: boolean;
	rescheduleButton?: boolean;
	hideClassLabel?: boolean;
	disableCheck?: boolean;
	menu?: TaskMenuOptions | null;
}

export interface TaskMenuOptions {
	delete?: boolean;
	edit?: boolean;
}

const DemoTask = ({
	task,
	disableCheck = false,
	checkbox = false,
	rescheduleButton = false,
	hideClassLabel = false,
	menu = undefined,
	workdayLabel = false,
	...props
}: TaskProps) => {
	const isMobile = useMediaQuery("(max-width: 900px)", false);

	const paperSx: Sx = (theme) => {
		return {
			opacity: task.complete ? 0.4 : 1,
			transition: "opacity .20s linear, height 1.20s linear",
		};
	};

	if (isMobile) {
		return (
			<Paper withBorder p="md" shadow="xs" sx={paperSx}>
				<Stack>
					<Group position="apart">
						<Group>
							<Text weight="bolder" size="sm">
								{task.title}
							</Text>
							{task.class && (
								<Badge size="xs" color={task.class.color}>
									{task.class.name}
								</Badge>
							)}
						</Group>
						{task.class && !hideClassLabel && (
							<>
								<Text size="sm">{task.workTime + "min."}</Text>
							</>
						)}
					</Group>
				</Stack>
			</Paper>
		);
	}

	return (
		<Paper withBorder p="md" shadow="xs" sx={paperSx}>
			<Group position="apart">
				<Group>
					<Text weight="bolder" size="sm">
						{task.title}
					</Text>
					{task.class && !hideClassLabel && (
						<>
							<Badge size="sm" color={task.class.color}>
								{task.class?.name}
							</Badge>
						</>
					)}
				</Group>
				<Group>
					<Text size="sm">{task.workTime + "min."}</Text>
					<Tooltip label="Reschedule" openDelay={300}>
						<ActionIcon size="sm">
							<Rotate360 size={18} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Group>
		</Paper>
	);
};

export default DemoTask;

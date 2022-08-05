import {
	ActionIcon,
	Box,
	Group,
	RingProgress,
	Stack,
	Text,
	Tooltip,
	useMantineTheme,
} from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { BsPause, BsPlayFill } from "react-icons/bs";
import {
	FaCheck,
	FaCross,
	FaPause,
	FaPlay,
	FaTrain,
	FaXbox,
} from "react-icons/fa";
import { TbCheck, TbX } from "react-icons/tb";
import { TiMediaPause } from "react-icons/ti";
import { FocusContext } from "../../../contexts/FocusContext";
import { SettingsContext } from "../../../contexts/SettingsContext";
import useTaskMutation from "../../../hooks/useTaskMutation";
import { secondToTimeDisplay } from "../../../utils/utils";

const iconSize = 40;

export default function BigFocusTimer() {
	const { focusState, fn: focusFn } = useContext(FocusContext);
	const { settings } = useContext(SettingsContext);
	const [percent, setPercent] = useState(50);
	const { height, width } = useViewportSize();
	const theme = useMantineTheme();
	const isMobile = useMediaQuery("(max-width: 900px)", false);

	const { checkMutation } = useTaskMutation();

	useEffect(() => {
		if (focusState.task?.workTime) {
			const percent =
				(focusState.secondsElapsed / (focusState.task.workTime * 60)) * 100;
			setPercent(percent);
		}
	}, [focusState]);

	const inside = (
		<Stack align="center" spacing={0}>
			<Text align="center" size={isMobile ? "md" : 20} weight="bold">
				{focusState.task?.title}
			</Text>
			<Text size={isMobile ? "md" : 20} align="center" weight={600}>
				{secondToTimeDisplay(focusState.secondsElapsed)}
			</Text>
			<Group mt="xl" position="apart">
				<Tooltip openDelay={300} label="Stop Working">
					<ActionIcon size={iconSize}>
						<TbX color={theme.colors.red[5]} size={iconSize} />
					</ActionIcon>
				</Tooltip>
				<Tooltip openDelay={300} label="Mark as Done">
					<ActionIcon
						loading={checkMutation.isLoading}
						size={iconSize}
						// onClick={completeTask}
					>
						<FaCheck color={theme.colors.green[5]} size={iconSize - 9} />
					</ActionIcon>
				</Tooltip>
				<Tooltip label="(Space)" openDelay={500}>
					<ActionIcon size={iconSize}>
						{focusState.working ? (
							<FaPause size={iconSize - 19} />
						) : (
							<FaPlay size={iconSize} />
						)}
					</ActionIcon>
				</Tooltip>
			</Group>
		</Stack>
	);
	return (
		<RingProgress
			sections={[{ value: percent, color: settings.themeColor }]}
			roundCaps
			size={width < 500 ? width : 500}
			label={inside}
		></RingProgress>
	);
}

import {
	ActionIcon, Group,
	Popover,
	RingProgress,
	Stack,
	Text,
	Tooltip,
	useMantineTheme
} from "@mantine/core";
import { useHotkeys, useMediaQuery, useViewportSize } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { useContext, useEffect, useState } from "react";
import { BsCheckLg, BsPlayFill } from "react-icons/bs";
import { GiPauseButton } from "react-icons/gi";
import { HiPlus } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FocusContext } from "../../../contexts/FocusContext";
import { SettingsContext } from "../../../contexts/SettingsContext";
import useTaskMutation from "../../../hooks/useTaskMutation";
import { logEvent } from "../../../lib/ga";
import { secondToTimeDisplay } from "../../../utils/client";

export default function BigFocusTimer() {
	const { focusState, fn: focusFn } = useContext(FocusContext);
	const { settings } = useContext(SettingsContext);
	const [percent, setPercent] = useState(50);
	const { height, width } = useViewportSize();
	const theme = useMantineTheme();
	const isMobile = useMediaQuery("(max-width: 900px)", false);
	const modals = useModals();

	const { checkMutation } = useTaskMutation();

	useEffect(() => {
		if (focusState.task?.workTime) {
			const percent =
				(focusState.secondsElapsed / (focusState.task.workTime * 60)) * 100;
			setPercent(percent);
		}
	}, [focusState]);

	useHotkeys([
		[
			"space",
			() => {
				toggleWorking();
			},
		],
	]);

	// COPIED FROM FocusModeDisplay.tsx
	const cancelTask = () => {
		modals.openConfirmModal({
			title: "Cancel Task",
			children: (
				<Text size="sm">
					Are you sure you want to stop working on this task?
				</Text>
			),
			labels: {
				confirm: "Stop",
				cancel: "Keep Working",
			},
			confirmProps: {
				color: "red",
			},
			onConfirm: () => {
				focusFn.cancel();
				logEvent("cancel_focus_task", {
					category: "focus",
					label: "focus_mode",
				});
			},
		});
	};

	// COPIED FROM FocusModeDisplay.tsx
	const completeTask = () => {
		if (!focusState.task || !focusState.task.workTime) {
			return;
		}
		modals.openConfirmModal({
			title: "Complete Task",
			children: (
				<Text size="sm">
					Are you sure you want to mark this task as complete?
				</Text>
			),
			labels: {
				confirm: "Complete",
				cancel: "Cancel",
			},
			confirmProps: {
				color: "green",
			},
			onConfirm: () => {
				if (!focusState.task) {
					return;
				}
				checkMutation.mutate({
					complete: true,
					id: focusState.task.id,
					minutes: Math.floor(focusState.secondsElapsed / 60),
				});
				focusFn.cancel();
				logEvent("complete_task", {
					label: "focus_mode",
				});
			},
		});
	};

	// COPIED FROM FocusModeDisplay.tsx
	const toggleWorking = () => {
		if (focusState.working) {
			focusFn.pause();
		} else {
			focusFn.play();
		}
	};

	const iconSize = isMobile ? 35 : 40;

	const inside = (
		<Stack align="center" spacing={0}>
			<Text
				align="center"
				size={isMobile ? "xl" : 20}
				sx={{
					maxWidth: width - width / 4,
					textOverflow: "ellipsis",
					overflow: "hidden",
				}}
				px="lg"
				weight="bold"
			>
				{focusState.task?.title}
			</Text>
			<Text size={isMobile ? "xl" : 20} align="center" weight={600}>
				{secondToTimeDisplay(focusState.secondsElapsed)}
			</Text>
			<Text
				size={isMobile ? "sm" : "xs"}
				align="center"
				color="dimmed"
				weight={600}
			>
				{secondToTimeDisplay((focusState.task?.workTime || 0) * 60)}
			</Text>
			<Group mt="lg" position="apart">
				<Tooltip.Group openDelay={600} closeDelay={100}>
					<Tooltip label="Stop Working">
						<ActionIcon size={iconSize}>
							<IoClose
								onClick={cancelTask}
								color={theme.colors.red[5]}
								size={iconSize}
							/>
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Mark as Done">
						<ActionIcon
							loading={checkMutation.isLoading}
							size={iconSize}
							onClick={completeTask}
						>
							<BsCheckLg color={theme.colors.green[5]} size={iconSize - 16} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Pause/Resume (Space)">
						<ActionIcon size={iconSize} onClick={toggleWorking}>
							{focusState.working ? (
								<GiPauseButton size={iconSize - 14} />
							) : (
								<BsPlayFill size={iconSize - 8} />
							)}
						</ActionIcon>
					</Tooltip>
					<Popover>
						<Popover.Target>
							<Tooltip label="Add 5 Minutes" >
								<ActionIcon onClick={() => focusFn.addTime(5)} size={iconSize}>
									<HiPlus size={iconSize - 6} onClick={focusFn.pause} />
								</ActionIcon>
							</Tooltip>
						</Popover.Target>
					</Popover>
				</Tooltip.Group>
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

import {
	ActionIcon,
	Affix,
	Box,
	Group,
	Paper,
	Text,
	Tooltip,
	Transition,
	useMantineTheme,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { NavigationProgress, setNavigationProgress } from "@mantine/nprogress";
import Head from "next/head";
import { useContext, useEffect } from "react";
import { BsPlayFill } from "react-icons/bs";
import { TbCheck, TbX } from "react-icons/tb";
import { TiMediaPause } from "react-icons/ti";
import { FocusContext } from "../../contexts/FocusContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import useTaskMutation from "../../hooks/useTaskMutation";
import { logEvent } from "../../lib/ga";

const iconSize = 25;

export default function FocusModeDisplay() {
	const { focusState, fn: focusFn } = useContext(FocusContext);
	const { settings } = useContext(SettingsContext);
	const modals = useModals();
	const theme = useMantineTheme();

	useHotkeys([
		[
			"space",
			() => {
				toggleWorking();
			},
		],
	]);

	const { checkMutation } = useTaskMutation();

	useEffect(() => {
		if (focusState.task?.workTime) {
			const percent =
				(focusState.secondsElapsed / (focusState.task.workTime * 60)) * 100;
			setNavigationProgress(percent);
		}
	}, [focusState]);

	const secondToTimeDisplay = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secondsLeft = seconds - minutes * 60;
		return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
	};

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

				logEvent("complete_task", {
					label: "focus_mode",
				});
			},
		});
	};

	const toggleWorking = () => {
		if (focusState.working) {
			focusFn.pause();
		} else {
			focusFn.play();
		}
	};

	if (!settings.useFocusMode) {
		return null;
	}

	return (
		<>
			{focusState.working && (
				<Head>
					<title>
						{secondToTimeDisplay(focusState.secondsElapsed) +
							" • " +
							focusState?.task?.title}
					</title>
				</Head>
			)}

			<NavigationProgress />

			<Affix zIndex={3} position={{ bottom: 20, right: 20 }}>
				<Transition
					transition="slide-up"
					duration={300}
					mounted={!!focusState.task && settings.useFocusMode}
				>
					{(styles) => (
						<Paper
							p="md"
							withBorder
							style={styles}
							radius="md"
							sx={(theme) => ({
								backgroundColor:
									theme.colorScheme === "dark"
										? theme.colors.dark[6]
										: theme.colors.white,
							})}
							shadow="md"
						>
							<Group>
								<Tooltip openDelay={300} label="Stop Working">
									<ActionIcon onClick={cancelTask} color="red" size={iconSize}>
										<TbX size={iconSize} />
									</ActionIcon>
								</Tooltip>
								<Tooltip openDelay={300} label="Mark as Done">
									<ActionIcon
										loading={checkMutation.isLoading}
										color="green"
										size={iconSize}
										onClick={completeTask}
									>
										<TbCheck size={iconSize} />
									</ActionIcon>
								</Tooltip>
								<Tooltip label="(Space)" openDelay={500}>
									<ActionIcon onClick={toggleWorking}>
										{focusState.working ? (
											<TiMediaPause size={iconSize} />
										) : (
											<BsPlayFill size={iconSize} />
										)}
									</ActionIcon>
								</Tooltip>

								<Box
									sx={(theme) => ({
										width: 70,
										textAlign: "center",
									})}
								>
									<Text color={theme.primaryColor} size="lg" weight="bold">
										{secondToTimeDisplay(focusState.secondsElapsed)}
									</Text>
								</Box>

								{!!focusState.task && (
									<Text size="sm" weight={600}>
										{focusState.task.title}
									</Text>
								)}
							</Group>
						</Paper>
					)}
				</Transition>
			</Affix>
		</>
	);
}

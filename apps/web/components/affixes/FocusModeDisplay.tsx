import {
	ActionIcon,
	Affix,
	Group,
	Paper,
	Stack,
	Text,
	Tooltip,
	Transition,
	useMantineTheme,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { NavigationProgress } from "@mantine/nprogress";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BsPlayFill } from "react-icons/bs";
import { TbCheck, TbX } from "react-icons/tb";
import { TiMediaPause } from "react-icons/ti";
import { ArrowsMaximize } from "tabler-icons-react";
import { FocusContext } from "../../contexts/FocusContext";
import { SettingsContext } from "../../contexts/SettingsContext";
import useTaskMutation from "../../hooks/useTaskMutation";
import { logEvent } from "../../lib/ga";
import { secondToTimeDisplay } from "../../utils/utils";

const iconSize = 25;

export default function FocusModeDisplay() {
	const { focusState, fn: focusFn } = useContext(FocusContext);
	const { settings } = useContext(SettingsContext);
	const modals = useModals();
	const theme = useMantineTheme();
	const router = useRouter();

	useHotkeys([
		[
			"space",
			() => {
				toggleWorking();
			},
		],
	]);

	const { checkMutation } = useTaskMutation();

	// COPIED TO BigFocusTimer.tsx
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

	// COPIED TO BigFocusTimer.tsx
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

	// COPIED TO BigFocusTimer.tsx
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
			{focusState.working && focusState.task && (
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
							<Stack>
								<Group position="center">
									<Text color={theme.primaryColor} size="lg" weight="bold">
										{secondToTimeDisplay(focusState.secondsElapsed)}
									</Text>

									{!!focusState.task && (
										<Text size="sm" weight={600}>
											{focusState.task.title}
										</Text>
									)}
								</Group>
								<Group position="apart">
									<Tooltip openDelay={300} label="Stop Working">
										<ActionIcon onClick={cancelTask} size={iconSize}>
											<TbX color={theme.colors.red[5]} size={iconSize} />
										</ActionIcon>
									</Tooltip>
									<Tooltip openDelay={300} label="Mark as Done">
										<ActionIcon
											loading={checkMutation.isLoading}
											size={iconSize}
											onClick={completeTask}
										>
											<TbCheck color={theme.colors.green[5]} size={iconSize} />
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
									<Tooltip label="(Space)" openDelay={500}>
										<ActionIcon onClick={() => router.replace("/focus")}>
											<ArrowsMaximize size={iconSize - 6} />
										</ActionIcon>
									</Tooltip>
								</Group>
							</Stack>
						</Paper>
					)}
				</Transition>
			</Affix>
		</>
	);
}

import { useLocalStorage } from "@mantine/hooks";
import { resetNavigationProgress } from "@mantine/nprogress";
import { createContext, useEffect, useState } from "react";
import { FocusModeState, TaskWithClass } from "types";
import superjson from "superjson";

const defaultContextState: FocusModeState = {
	task: null,
	working: false,
	pauseTime: null,
	startTime: null,
	secondsElapsed: 0,
};

export const FocusContext = createContext<{
	focusState: FocusModeState;
	setFocusState: (state: FocusModeState) => void;
	fn: {
		cancel: () => void;
		pause: () => void;
		play: () => void;
		startTask: (task: TaskWithClass) => void;
		addTime: (min: number) => void;
	};
}>({
	focusState: defaultContextState,
	setFocusState: () => {},
	fn: {
		cancel: () => {},
		pause: () => {},
		play: () => {},
		startTask: () => {},
		addTime: () => {},
	},
});

export default function FocusContextProvider({ children }: any) {
	const [focusState, setFocusState] = useLocalStorage<FocusModeState>({
		key: "focusState",
		serialize: (state) => superjson.stringify(state),
		deserialize: (str) => {
			try {
				return superjson.parse(str);
			} catch (e) {
				return defaultContextState;
			}
		},
	});

	useEffect(() => {
		const code = setInterval(() => {
			setFocusState((state) => {
				if (!state.startTime) {
					return {
						...state,
					};
				}
				const timeToAdd = state.pauseTime?.getTime() ?? 0;
				let seconds = 0;
				if (timeToAdd > 0) {
					seconds = Math.round((timeToAdd - state.startTime.getTime()) / 1000);
				} else {
					seconds = Math.round(
						(Date.now() - timeToAdd - state.startTime.getTime()) / 1000
					);
				}
				return {
					...state,
					secondsElapsed: seconds,
				};
			});
		}, 300);

		return () => {
			clearInterval(code);
		};
	}, []);

	const fn = {
		cancel: () => {
			setFocusState({
				...focusState,
				working: false,
				startTime: null,
				pauseTime: null,
				secondsElapsed: 0,
				task: null,
			});
			resetNavigationProgress();
		},

		pause: () => {
			setFocusState({
				...focusState,
				working: false,
				pauseTime: new Date(),
			});
		},

		play: () => {
			setFocusState((prevState) => {
				if (!prevState.startTime) {
					return prevState;
				}
				// Get time since pause
				const now = new Date();
				const timeToAdd = prevState.pauseTime
					? now.getTime() - prevState.pauseTime.getTime()
					: 0;
				const timeSincePause = prevState.pauseTime
					? now.getTime() - prevState.pauseTime.getTime()
					: 0;

				// Subtract time since pause from previous time elapsed
				const newStartTime = new Date(
					prevState.startTime.getTime() + timeSincePause
				);
				return {
					...focusState,
					working: true,
					pauseTime: null,
					startTime: newStartTime,
				};
			});
		},

		addTime: (min: number) => {
			if (!focusState.task) {
				return;
			}
			setFocusState({
				...focusState,
				task: {
					...focusState.task,
					workTime: focusState?.task?.workTime + min,
				},
			});
		},

		startTask(task: TaskWithClass) {
			setFocusState({
				...focusState,
				task,
				pauseTime: null,
				startTime: new Date(),
				secondsElapsed: 0,
				working: true,
			});
		},
	};

	return (
		<FocusContext.Provider value={{ focusState, setFocusState, fn }}>
			{children}
		</FocusContext.Provider>
	);
}

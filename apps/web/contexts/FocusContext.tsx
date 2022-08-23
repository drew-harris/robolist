import { useLocalStorage } from "@mantine/hooks";
import { resetNavigationProgress } from "@mantine/nprogress";
import { createContext, useEffect, useRef, useState } from "react";
import { FocusModeState, TaskWithClass } from "types";
import superjson from "superjson";

const defaultContextState: FocusModeState = {
	task: null,
	working: false,
	pauseTime: null,
	startTime: null,
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

export const SecondsElapsedContext = createContext<number>(0);

export default function FocusContextProvider({ children }: any) {
	const [secondsElapsed, setSecondsElapsed] = useState(0);
	const focusStateDupe = useRef(defaultContextState);
	const [focusState, setFocusState] = useLocalStorage<FocusModeState>({
		key: "focus",
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
		if (typeof window !== "undefined") {
			window.localStorage.removeItem("focusState");
		}
	}, []);

	const updateSeconds = () => {
		if (!focusStateDupe.current.startTime) {
			return;
		}
		const timeToAdd = focusStateDupe.current.pauseTime?.getTime() ?? 0;
		let seconds = 0;
		if (timeToAdd > 0) {
			seconds = Math.round(
				(timeToAdd - focusStateDupe.current.startTime.getTime()) / 1000
			);
		} else {
			seconds = Math.round(
				(Date.now() - timeToAdd - focusStateDupe.current.startTime.getTime()) /
					1000
			);
		}
		setSecondsElapsed(seconds);
	};

	useEffect(() => {
		const code = setInterval(() => {
			updateSeconds();
		}, 400);

		return () => {
			clearInterval(code);
		};
	}, []);

	useEffect(() => {
		focusStateDupe.current = focusState;
	}, [focusState]);

	const fn = {
		cancel: () => {
			setFocusState({
				...focusState,
				working: false,
				startTime: null,
				pauseTime: null,
				task: null,
			});
			setSecondsElapsed(0);
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
			if (!focusState.task || !focusState.task.workTime) {
				return;
			}
			setFocusState({
				...focusState,
				task: {
					...focusState.task,
					workTime: focusState?.task?.workTime + min,
				},
			});
			updateSeconds();
		},

		startTask(task: TaskWithClass) {
			setFocusState({
				...focusState,
				task,
				pauseTime: null,
				startTime: new Date(),
				working: true,
			});
		},
	};

	return (
		<FocusContext.Provider value={{ focusState, setFocusState, fn }}>
			<SecondsElapsedContext.Provider value={secondsElapsed}>
				{children}
			</SecondsElapsedContext.Provider>
		</FocusContext.Provider>
	);
}

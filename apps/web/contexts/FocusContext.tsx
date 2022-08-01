import { useLocalStorage } from "@mantine/hooks";
import { resetNavigationProgress } from "@mantine/nprogress";
import { createContext, useEffect } from "react";
import { FocusModeState, TaskWithClass } from "types";

const defaultContextState: FocusModeState = {
	task: null,
	secondsElapsed: 0,
	working: false,
};

export const FocusContext = createContext<{
	focusState: FocusModeState;
	setFocusState: (state: FocusModeState) => void;
	fn: {
		start: () => void;
		cancel: () => void;
		pause: () => void;
		play: () => void;
		startTask: (task: TaskWithClass) => void;
	};
}>({
	focusState: defaultContextState,
	setFocusState: () => {},
	fn: {
		start: () => {},
		cancel: () => {},
		pause: () => {},
		play: () => {},
		startTask: () => {},
	},
});

export default function FocusContextProvider({ children }: any) {
	const [focusState, setFocusState] = useLocalStorage<FocusModeState>({
		key: "focusState",
		serialize: (state) => JSON.stringify(state),
		deserialize: (str) => {
			try {
				return JSON.parse(str);
			} catch (e) {
				return defaultContextState;
			}
		},
	});

	useEffect(() => {
		const code = setInterval(() => {
			setFocusState((state) => {
				if (state.working) {
					return {
						...state,
						secondsElapsed: state.secondsElapsed + 1,
					};
				} else {
					return state;
				}
			});
		}, 1000);

		return () => {
			clearInterval(code);
		};
	}, []);

	const fn = {
		start: () => {
			setFocusState({
				...focusState,
				working: true,
			});
			resetNavigationProgress();
		},

		cancel: () => {
			setFocusState({
				...focusState,
				working: false,
				secondsElapsed: 0,
				task: null,
			});
			resetNavigationProgress();
		},

		pause: () => {
			setFocusState({
				...focusState,
				working: false,
			});
		},

		play: () => {
			setFocusState({
				...focusState,
				working: true,
			});
		},

		startTask(task: TaskWithClass) {
			setFocusState({
				...focusState,
				task,
				secondsElapsed: 0,
				working: true,
			});
			resetNavigationProgress();
		},
	};

	return (
		<FocusContext.Provider value={{ focusState, setFocusState, fn }}>
			{children}
		</FocusContext.Provider>
	);
}

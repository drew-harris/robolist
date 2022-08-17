import { TaskWithClass } from ".";

export interface FocusModeState {
	task: TaskWithClass | null;
	working: boolean; // true iff the user is working on a task
	// secondsElapsed: number;
	startTime: Date | null;
	pauseTime: Date | null;
}

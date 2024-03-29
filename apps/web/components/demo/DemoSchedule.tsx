import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { TDemoTask } from "types";
import TaskAgendaContainer from "../containers/TaskAgendaContainer";

const thisMorning = new Date();
thisMorning.setHours(0, 0, 0, 0);

const initialTasks: TDemoTask[] = [
	{
		id: "1",
		title: "Sign Syllabus",
		// Today
		workDate: thisMorning,
		workTime: 4,
		class: {
			color: "blue",
			name: "Math",
			createdAt: new Date(),
			updatedAt: new Date(),
			id: "239",
			userId: "1",
			canvasId: null,
			canvasName: null,
			canvasUUID: null,
		},
		complete: false,
	},
	{
		id: "2",
		title: "Study For Test",
		// Tomorrow
		workDate: new Date(thisMorning.getTime() + 24 * 60 * 60 * 1000),
		workTime: 50,
		class: {
			color: "red",
			name: "Science",
			id: "239",
			userId: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
			canvasId: null,
			canvasName: null,
			canvasUUID: null,
		},
		complete: false,
	},
	{
		id: "3",
		title: "Review Vocab",
		// Tomorrow
		workDate: new Date(thisMorning.getTime() + 24 * 60 * 60 * 1000 * 2),
		workTime: 15,
		class: {
			color: "green",
			name: "Writing",
			id: "239",
			userId: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
			canvasId: null,
			canvasName: null,
			canvasUUID: null,
		},
		complete: false,
	},
	{
		id: "4",
		title: "Submit HW4",
		workDate: new Date(thisMorning.getTime() + 24 * 60 * 60 * 1000 * 3),
		workTime: 20,
		class: {
			color: "green",
			name: "Writing",
			id: "239",
			userId: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
			canvasId: null,
			canvasName: null,
			canvasUUID: null,
		},
		complete: false,
	},
	{
		id: "5",
		title: "Finish Report",
		workDate: new Date(thisMorning.getTime() + 24 * 60 * 60 * 1000 * 4),
		workTime: 20,
		class: {
			color: "grape",
			name: "U.S. History",
			id: "239",
			userId: "1",
			createdAt: new Date(),
			updatedAt: new Date(),
			canvasId: null,
			canvasName: null,
			canvasUUID: null,
		},
		complete: false,
	},
];

export default function DemoScheduleController() {
	const [tasks, setTasks] = useState<TDemoTask[]>(initialTasks);
	// Every 3 seconds shuffle tasks
	function shuffleTasks() {
		setTasks((tasks) => {
			return tasks
				.map((task) => {
					task.workDate = new Date(
						thisMorning.getTime() +
							24 * 60 * 60 * 1000 * (Math.floor(Math.random() * 5) + 1)
					);
					return task;
				})
				.sort((a, b) => a.workDate.getTime() - b.workDate.getTime());
		});
	}

	const interval = useInterval(() => {
		shuffleTasks();
	}, 3000);

	useEffect(() => {
		interval.start();
	}, [interval]);

	return <TaskAgendaContainer demo={true} tasks={tasks} />;
}

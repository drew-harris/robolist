import { Select } from "@mantine/core";
import type { Prisma } from "@prisma/client";

export type SortByValueOptions = Prisma.TaskScalarFieldEnum;

interface SortBySelectorProps {
	value: SortByValueOptions;
	setValue: (value: SortByValueOptions) => void;
}
export default function SortBySelector({
	value,
	setValue,
}: SortBySelectorProps) {
	const realOptions: { label: string; value: SortByValueOptions }[] = [
		{
			label: "Due Date",
			value: "dueDate",
		},
		{
			value: "workDate",
			label: "Work Date",
		},
		{
			value: "complete",
			label: "Complete",
		},
		{
			value: "createdAt",
			label: "Recently Created",
		},
		{
			label: "Recently Updated",
			value: "updatedAt",
		},
	];

	return (
		<Select
			onChange={(value) => setValue(value as SortByValueOptions)}
			data={realOptions}
			value={value}
			label="Sort By"
		></Select>
	);
}

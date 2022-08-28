import { Select, SelectItem } from "@mantine/core";
import { SelectSharedProps } from "@mantine/core/lib/Select/Select";
import type { Prisma } from "@prisma/client";
import { stableValueHash } from "react-query/types/core/utils";

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
			label: "Last Updated",
			value: "updatedAt",
		},
		{
			value: "workDate",
			label: "Work Date",
		},
		{
			value: "complete",
			label: "Complete",
		},
	];

	return (
		<Select
			onChange={(value) => setValue(value as SortByValueOptions)}
			data={realOptions}
			value={value}
		></Select>
	);
}

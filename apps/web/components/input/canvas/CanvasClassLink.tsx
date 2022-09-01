import { Box, BoxProps, Loader, Select, Text } from "@mantine/core";
import { Class } from "@prisma/client";
import { NextRequest } from "next/server";
import { useState } from "react";
import { stableValueHash } from "react-query/types/core/utils";
import { trpc } from "../../../utils/trpc";

export interface CanvasClassLinkProps extends BoxProps {
	value: number | null;
	setValue: (value: number | null) => void;
}
export default function CanvasClassLink({
	value,
	setValue,
	...boxProps
}: CanvasClassLinkProps) {
	const { data, status } = trpc.useQuery(["canvas.courses", {}]);

	const convertAndSetValue = (value: string | null) => {
		setValue(value ? parseInt(value) : null);
	};

	return (
		<Box {...boxProps}>
			{data && (
				<Select
					value={value?.toString()}
					data={data.map((course) => {
						return {
							label: course.course_code,
							value: course.id.toString(),
						};
					})}
					onChange={convertAndSetValue}
					label="Link with Canvas"
					placeholder="Select class from Canvas"
				></Select>
			)}
		</Box>
	);
}

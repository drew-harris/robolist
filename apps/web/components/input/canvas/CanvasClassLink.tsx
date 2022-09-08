import { Box, BoxProps, Loader, Select, Text } from "@mantine/core";
import { Class } from "@prisma/client";
import { NextRequest } from "next/server";
import { useState } from "react";
import { stableValueHash } from "react-query/types/core/utils";
import { trpc } from "../../../utils/trpc";

export interface CanvasClassLinkProps extends BoxProps {
	value: number | null;
	setValue: (value: number | null) => void;
	placeHolder?: string;
}
export default function CanvasClassLink({
	value,
	setValue,
	placeHolder,
	...boxProps
}: CanvasClassLinkProps) {
	const { data, status } = trpc.useQuery([
		"canvas.courses",
		{ excludeConnected: true },
	]);

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
					placeholder={placeHolder || "Select class from Canvas"}
				></Select>
			)}
		</Box>
	);
}

import { Box, Loader, Select, Text } from "@mantine/core";
import { Class } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";

export interface CanvasClassLinkProps {
	class: Class;
	setLoading: (loading: boolean) => void;
}
export default function CanvasClassLink({
	class: _class,
	setLoading,
}: CanvasClassLinkProps) {
	const { data, status } = trpc.useQuery(["canvas.courses", {}]);
	const linkMutaton = trpc.useMutation(["canvas.link-class"]);
	const [currentClassId, setCurrentClassId] = useState<string | null>(
		_class.canvasId?.toString() || null
	);

	const changeLink = (value: string) => {
		const prevClassId = currentClassId;
		setCurrentClassId(value || null);
		linkMutaton.mutate(
			{
				classId: _class.id,
				canvasClassId: parseInt(value),
			},
			{
				onSuccess: (_class) => {
					setCurrentClassId(_class.canvasId?.toString() || null);
					setLoading(false);
				},
				onError: () => {
					setCurrentClassId(prevClassId);
					setLoading(false);
				},
			}
		);
		setLoading(true);
	};

	return (
		<Box>
			{data && (
				<Select
					rightSection={
						linkMutaton.status === "loading" ? <Loader size="xs" /> : null
					}
					value={currentClassId}
					data={data.map((course) => {
						return {
							label: course.course_code,
							value: course.id.toString(),
						};
					})}
					onChange={changeLink}
					placeholder="Link to Canvas Class"
				></Select>
			)}
		</Box>
	);
}

import { Loader, Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Class } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { School } from "tabler-icons-react";
import { getClasses } from "../../clientapi/classes";

interface IdPickerProps {
	form: UseFormReturnType<any>;
}

export default function ClassIdPicker(props: IdPickerProps) {
	const {
		data: classes,
		error,
		status,
	} = useQuery<Class[], Error>(["classes"], getClasses);

	const classLabels = classes
		? classes.map((c) => {
			return {
				label: c.name,
				value: c.id,
			};
		})
		: [];

	return (
		<Select
			{...props.form.getInputProps("classId")}
			label="Class"
			icon={status === "loading" ? <Loader size={18} /> : <School size={18} />}
			data={classLabels}
			disabled={!classes || classes.length === 0}
			placeholder={classes && classes.length === 0 ? "No Classes" : "Select Class"}
			clearable={true}
		></Select>
	);
}

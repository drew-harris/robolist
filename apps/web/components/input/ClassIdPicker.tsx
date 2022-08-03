import { Loader, Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Class } from "@prisma/client";
import { useEffect, useState } from "react";
import { School } from "tabler-icons-react";
import { APINewTaskRequest, TaskWithClass } from "types";
import { getClasses } from "../../clientapi/classes";

interface IdPickerProps {
	form: UseFormReturnType<any>;
}

export default function ClassIdPicker(props: IdPickerProps) {
	const [classes, setClasses] = useState<Class[]>([]);
	const [loading, setLoading] = useState(true);
	const fetchClasses = async () => {
		const classes = await getClasses();
		setClasses(classes);
		setLoading(false);
	};

	useEffect(() => {
		fetchClasses();
	}, []);

	const classLabels = classes.map((c) => {
		return {
			label: c.name,
			value: c.id,
		};
	});

	return (
		<Select
			{...props.form.getInputProps("classId")}
			label="Class"
			icon={loading ? <Loader size={18} /> : <School size={18} />}
			data={classLabels}
			disabled={classes.length === 0}
			placeholder="No Class Selected"
			clearable={true}
		></Select>
	);
}

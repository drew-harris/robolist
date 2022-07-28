import { Select } from "@mantine/core";
import { formList } from "@mantine/form";
import { UseFormReturnType } from "@mantine/form/lib/use-form";
import { Class } from "@prisma/client";
import { useEffect, useState } from "react";
import { APINewTaskRequest } from "types";
import { getClasses } from "../../clientapi/classes";

interface IdPickerProps {
  form: UseFormReturnType<APINewTaskRequest>;
}

export default function ClassIdPicker(props: IdPickerProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const fetchClasses = async () => {
    const classes = await getClasses();
    setClasses(classes);
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
      style={{ flexGrow: 3 }}
      data={classLabels}
      disabled={classes.length === 0}
      placeholder="No Class Selected"
      clearable={true}
    ></Select>
  );
}

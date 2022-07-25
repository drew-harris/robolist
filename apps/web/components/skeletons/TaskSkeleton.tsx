import {
  Badge,
  Checkbox,
  Group,
  Paper,
  Skeleton,
  Sx,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { TaskWithClass } from "types";
import { TaskOptionProps } from "../data-display/Task";

const TaskSkeleton = ({
  disableCheck = false,
  hideCheckbox = false,
  disableEdit = false,
  disableQuickSettings = false,
  ...props
}: TaskOptionProps) => {
  const theme = useMantineTheme();

  const [width, setWidth] = React.useState(
    Math.floor(Math.random() * 100) + 100
  );

  // random width between 100 and 200
  return (
    <Paper p="md" shadow="xs">
      <Group>
        {!hideCheckbox && <Skeleton width={20} height={20} />}
        <Skeleton width={width} height={8}></Skeleton>
      </Group>
    </Paper>
  );
};

export default TaskSkeleton;

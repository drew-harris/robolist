import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  MenuItem,
  Paper,
  Space,
  Sx,
  Text,
  Tooltip,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ModalsContext } from "@mantine/modals/lib/context";
import { useContext } from "react";
import { Calendar, Rotate360, Trash } from "tabler-icons-react";
import { TaskWithClass } from "types";
import { SettingsContext } from "../../../contexts/SettingsContext";
import useTaskMutation from "../../../hooks/useTaskMutation";
import { getHumanDateString } from "../../../utils";
import RescheduleButton from "./RescheduleButton";
import TaskCheckbox from "./TaskCheckbox";
import TaskPlayButton from "./TaskPlayButton";

type TaskProps = TaskOptionProps & {
  task: TaskWithClass;
};

export interface TaskOptionProps {
  checkbox?: boolean;
  workdayLabel?: boolean;
  rescheduleButton?: boolean;
  hideClassLabel?: boolean;
  disableCheck?: boolean;
  menu?: TaskMenuOptions;
}

export interface TaskMenuOptions {
  delete?: boolean;
}

const Task = ({
  task,
  disableCheck = false,
  checkbox = false,
  rescheduleButton = false,
  hideClassLabel = false,
  menu: menuOptions = {
    delete: false,
  },
  workdayLabel = false,
  ...props
}: TaskProps) => {
  const { settings } = useContext(SettingsContext);
  const modals = useModals();
  const { deleteMutation } = useTaskMutation();

  const checkboxElement = settings.useFocusMode ? (
    <TaskPlayButton task={task} />
  ) : (
    <TaskCheckbox task={task} disabled={disableCheck} key={task.id} />
  );

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const isLateWork =
    task.dueDate && !task.complete && task.workDate < oneDayAgo;
  const isOverdue = task.dueDate && !task.complete && task.dueDate < new Date();

  const promptDelete = () => {
    modals.openConfirmModal({
      title: "Delete Task?",
      onConfirm: () => {
        deleteMutation.mutate(task);
      },
      children: (
        <>
          <Text size="sm">Are you sure you want to delete this task?</Text>
        </>
      ),
      labels: {
        confirm: "Delete",
        cancel: "Cancel",
      },
      confirmProps: {
        color: "red",
      },
    });
  };

  const menuComponent = menuOptions ? (
    <Menu size="sm">
      {menuOptions.delete && (
        <MenuItem color="red" onClick={promptDelete} icon={<Trash />}>
          Delete
        </MenuItem>
      )}
    </Menu>
  ) : null;

  const paperSx: Sx = (theme) => {
    let backgroundColor: string | undefined;

    if (isOverdue) {
      backgroundColor = theme.fn.rgba(theme.colors.red[5], 0.4);
    } else if (isLateWork) {
      backgroundColor = theme.fn.rgba(theme.colors.orange[4], 0.2);
    }

    return {
      opacity: task.complete ? 0.4 : 1,
      transition: "opacity .20s linear",
      backgroundColor,
    };
  };

  return (
    <Paper withBorder p="md" shadow="xs" sx={paperSx}>
      <Group position="apart">
        <Group>
          {checkbox && checkboxElement}
          <Text weight="bolder">{task.title}</Text>
          {task.class && !hideClassLabel && (
            <>
              <Badge size="sm" color={task.class.color}>
                {task.class?.name}
              </Badge>
            </>
          )}
          {workdayLabel && (
            <>
              <Space w="sm" />
              <Text>{getHumanDateString(task.workDate)}</Text>
            </>
          )}
        </Group>
        <Group>
          <Text size="sm">{task.workTime + "min."}</Text>
          {rescheduleButton && <RescheduleButton task={task} />}
          {menuComponent}
        </Group>
      </Group>
    </Paper>
  );
};

export default Task;

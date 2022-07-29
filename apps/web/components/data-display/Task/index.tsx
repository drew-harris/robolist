import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  Menu,
  MenuItem,
  Paper,
  Space,
  Sx,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useContext } from "react";
import {
  ArrowLeftRight,
  ArrowsLeftRight,
  ArrowsRandom,
  Calendar,
  Rotate360,
} from "tabler-icons-react";
import { TaskWithClass } from "types";
import { SettingsContext } from "../../../contexts/SettingsContext";
import { dateIsToday } from "../../../utils";
import TaskCheckbox from "./TaskCheckbox";
import TaskPlayButton from "./TaskPlayButton";

type TaskProps = TaskOptionProps & {
  task: TaskWithClass;
};

export interface TaskOptionProps {
  checkbox?: boolean;
  rescheduleButton?: boolean;
  hideClassLabel?: boolean;
  disableCheck?: boolean;
  menu?: TaskMenuOptions;
}

export interface TaskMenuOptions {}

const Task = ({
  task,
  disableCheck = false,
  checkbox = false,
  rescheduleButton = false,
  hideClassLabel = false,
  menu: menuOptions,
  ...props
}: TaskProps) => {
  const { settings } = useContext(SettingsContext);

  const checkboxElement = settings.useFocusMode ? (
    <TaskPlayButton task={task} />
  ) : (
    <TaskCheckbox task={task} disabled={disableCheck} key={task.id} />
  );

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const isLateWork =
    task.dueDate && !task.complete && task.workDate < oneDayAgo;
  const isOverdue = task.dueDate && !task.complete && task.dueDate < new Date();

  const menuComponent = menuOptions ? (
    <Menu size="sm">
      <MenuItem
        onClick={() => {
          alert("Test");
        }}
        icon={<Calendar />}
      >
        Test
      </MenuItem>
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
          <Text>{task.title}</Text>
          {task.class && !hideClassLabel && (
            <>
              <Badge size="sm" color={task.class.color}>
                {task.class?.name}
              </Badge>
            </>
          )}
        </Group>
        <Group>
          {rescheduleButton && (
            <Tooltip label="Reschedule" openDelay={300}>
              <ActionIcon>
                <Rotate360 size={18} />
              </ActionIcon>
            </Tooltip>
          )}
          {menuComponent}
        </Group>
      </Group>
    </Paper>
  );
};

export default Task;

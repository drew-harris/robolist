import { Box } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { TaskWithClass } from "types";
import { getTasks } from "../../clientapi/tasks";
import Task from "../../components/data-display/Task";
import { getTasksFromId } from "../../serverapi/tasks";
import { getUserFromJWT } from "../../utils";

interface TasksPageProps {
  tasks: TaskWithClass[];
}

export default function TasksPage({ tasks: initialTasks }: TasksPageProps) {
  const { data: tasks, error } = useQuery<TaskWithClass[], Error>(
    ["tasks"],
    getTasks,
    { initialData: initialTasks }
  );

  const taskElements = tasks
    ? tasks.map((class_) => {
        return <Task key={class_.id} task={class_} />;
      })
    : null;

  return (
    <>
      <Box>{taskElements}</Box>
    </>
  );
}

export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<TasksPageProps>> {
  const jwt = getCookie("jwt", context);
  const user = getUserFromJWT(jwt?.toString());
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const tasks = await getTasksFromId(user.id);
  return {
    props: {
      tasks,
    }, // will be passed to the page component as props
  };
}

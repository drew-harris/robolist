import { SimpleGrid, Title, Text } from "@mantine/core";
import { Class } from "@prisma/client";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import { getClasses } from "../../clientapi/classes";
import ClassSquare from "../../components/data-display/ClassSquare";
import { getClassesFromId } from "../../serverapi/classes";
import { getUserFromJWT } from "../../utils";

interface ClassPageProps {
  dehydratedState: any;
}
const ClassesPage = () => {
  const { data: classes, error } = useQuery<Class[], Error>(
    ["classes"],
    getClasses
  );

  const classElements = classes
    ? classes.map((class_) => {
        return <ClassSquare key={class_.id} class={class_} />;
      })
    : null;

  return (
    <>
      <Title mb="md">Classes</Title>
      {error ? (
        <Text color="red" size="lg" ml="lg">
          {error.message}
        </Text>
      ) : (
        <SimpleGrid cols={4}>{classElements}</SimpleGrid>
      )}
    </>
  );
};

export default ClassesPage;

export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<ClassPageProps>> {
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

  const client = new QueryClient();

  await client.prefetchQuery(["classes"], async () => {
    const classes = await getClassesFromId(user.id);
    return classes;
  });

  return {
    props: {
      dehydratedState: dehydrate(client),
    }, // will be passed to the page component as props
  };
}

import { Box, SimpleGrid, Title } from "@mantine/core";
import { Class, PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";
import { GetServerSidePropsResult, NextPageContext } from "next";
import ClassSquare from "../../components/data-display/ClassSquare";
import { getUserFromJWT } from "../../utils";

interface ClassPageProps {
  classes: Class[];
}
const ClassesPage = ({ classes }: ClassPageProps) => {
  const classElements = classes.map((class_) => {
    return <ClassSquare class={class_} />;
  });
  return (
    <>
      <Title mb="md">Classes</Title>
      <SimpleGrid cols={4}>{classElements}</SimpleGrid>
    </>
  );
};

export default ClassesPage;

export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<ClassPageProps>> {
  const jwt = getCookie("jwt", context);
  const user = getUserFromJWT(jwt?.toString());
  console.log(user);
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prisma = new PrismaClient();
  const classes = await prisma.class.findMany({
    where: {
      userId: user.id,
    },
  });

  console.log(classes);

  return {
    props: {
      classes: classes,
    }, // will be passed to the page component as props
  };
}

import { Box, MantineTheme, Sx } from "@mantine/core";
import { Class } from "@prisma/client";

interface ClassSquareProps {
  class: Class;
}

const ClassSquare = (props: ClassSquareProps) => {
  const squareSx: Sx = (theme: MantineTheme) => ({
    backgroundColor:
      theme.colorScheme == "dark"
        ? theme.fn.darken(theme.colors[props.class.color][9], 0.2)
        : theme.colors[props.class.color][0],
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    fontWeight: 600,
  });
  return <Box sx={squareSx}>{props.class.name}</Box>;
};

export default ClassSquare;

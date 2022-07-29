import { Box, MantineTheme, Paper, Sx } from "@mantine/core";
import { Class } from "@prisma/client";

interface ClassSquareProps {
  class: Class;
}

const ClassSquare = (props: ClassSquareProps) => {
  const squareSx: Sx = (theme: MantineTheme) => ({
    backgroundColor:
      theme.colorScheme == "dark"
        ? theme.fn.darken(theme.colors[props.class.color][9], 0.2)
        : theme.colors[props.class.color][4],
    padding: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    fontWeight: 600,
  });
  return (
    <Paper sx={squareSx} shadow="md">
      {props.class.name}
    </Paper>
  );
};

export default ClassSquare;

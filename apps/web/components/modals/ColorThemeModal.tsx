import { Button, Text, useMantineColorScheme } from "@mantine/core";
import { useModals } from "@mantine/modals";
export default function ColorThemeModal() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const modals = useModals();
  const onClick = () => {
    toggleColorScheme();
    modals.closeModal("color theme");
  };
  return <Button onClick={onClick}>toggle</Button>;
}

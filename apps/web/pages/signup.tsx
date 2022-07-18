import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { setCookie } from "cookies-next";
import { NextRouter, useRouter } from "next/router";
import { APILoginRequest } from "types";

interface SignupForm extends APILoginRequest {
  confirmPassword: string;
}

export default function SignUp() {
  const router: NextRouter = useRouter();
  const form = useForm<SignupForm>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(form.values);
    const values = form.values;
    if (values.password !== values.confirmPassword) {
      showNotification({
        message: "Passwords do not match",
        color: "red",
      });
      return;
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.jwt);
      setCookie("jwt", data.jwt);
      router.replace("/tasks");
    } else {
      const data = await response.json();
      showNotification({
        message: data.error.message,
        color: "red",
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Sign Up
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        {"Already have an account?   "}
        <Anchor<"a">
          href="#"
          size="sm"
          onClick={(event) => event.preventDefault()}
        >
          Log In
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="you@robolist.net"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            required
            mt="md"
            {...form.getInputProps("confirmPassword")}
          />
          <Button type="submit" fullWidth mt="xl">
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

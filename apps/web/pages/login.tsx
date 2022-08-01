import {
	Anchor,
	Button,
	Center,
	Container,
	LoadingOverlay,
	Paper,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { APILoginRequest, APIRegisterResponse } from "types";
import { logEvent } from "../lib/ga";
const Login = () => {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<APILoginRequest>({
		initialValues: {
			email: "",
			password: "",
		},
	});

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		console.log(form.values);
		const response = await fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(form.values),
		});

		if (response.ok) {
			const data = await response.json();
			setCookie("jwt", data.jwt);
			logEvent("login", {
				category: "user",
			});
			router.replace("/tasks");
			console.log(data);
		} else {
			const data: APIRegisterResponse = await response.json();
			setError(data.error?.message || "Unknown error");
			setLoading(false);
		}
	}

	return (
		<Container size={420} my={40}>
			<Title
				align="center"
				sx={(theme) => ({
					fontFamily: `Greycliff CF, ${theme.fontFamily}`,
					fontWeight: 900,
				})}
			>
				Welcome back!
			</Title>
			<Text color="dimmed" size="sm" align="center" mt={5}>
				{"Don't have an account yet?   "}
				<Link href="/signup">
					<Anchor<"a"> size="sm">Create account</Anchor>
				</Link>
			</Text>

			<Paper
				withBorder
				style={{ position: "relative" }}
				shadow="md"
				p={30}
				mt={30}
				radius="md"
			>
				<LoadingOverlay visible={loading} radius="md" />
				<form onSubmit={handleSubmit}>
					<TextInput
						label="Email"
						placeholder="you@robolist.net"
						className="email-field"
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

					{error && (
						<Center mt={"md"}>
							<Text size="sm" color="red">
								{error}
							</Text>
						</Center>
					)}

					<Button fullWidth mt="xl" type="submit">
						Sign in
					</Button>
				</form>
			</Paper>
		</Container>
	);
};

export default Login;

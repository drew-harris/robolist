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
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useState } from "react";
import { APILoginRequest, APIRegisterResponse } from "types";
import { logEvent } from "../lib/ga";
import { trpc } from "../utils/trpc";

interface SignupForm extends APILoginRequest {
	confirmPassword: string;
}

export default function SignUp() {
	const router: NextRouter = useRouter();
	const trpcClient = trpc.useContext();
	const form = useForm<SignupForm>({
		initialValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		console.log(form.values);
		const values = form.values;
		if (values.password !== values.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		const response = await fetch("/api/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});

		const data: APIRegisterResponse = await response.json();
		if (response.ok) {
			console.log(data.jwt);
			logEvent("sign_up", {
				category: "user",
				value: values.email,
			});
			trpcClient.refetchQueries(["theme-and-settings"]);
			router.replace("/classes");
		} else {
			setError(data.error?.message || "Unknown error");
			setLoading(false);
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
				<Link href="/login">
					<Anchor<"a"> size="sm" onClick={(event) => event.preventDefault()}>
						Log In
					</Anchor>
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
				<LoadingOverlay radius={"md"} visible={loading} />
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

					{error && (
						<Center mt={"md"}>
							<Text size="sm" color="red">
								{error}
							</Text>
						</Center>
					)}

					<Button type="submit" fullWidth mt="xl">
						Sign Up
					</Button>
				</form>
			</Paper>
		</Container>
	);
}

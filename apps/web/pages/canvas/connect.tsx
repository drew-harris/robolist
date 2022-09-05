import {
	Box,
	Button,
	Center,
	Group,
	Loader,
	Stack,
	Stepper,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useContext, useState } from "react";
import { Check, Link as LinkIcon, LockAccess } from "tabler-icons-react";
import {
	InferMutationInput,
	InferMutationOutput,
	trpc,
} from "../../utils/trpc";
import { UserContext } from "../_app";

export default function CanvasConnectPage() {
	const connectMutation = trpc.useMutation("canvas-info.verify-info", {
		ssr: false,
	});

	const trpcClient = trpc.useContext();
	const user = useContext(UserContext);

	const form = useForm<InferMutationInput<"canvas-info.verify-info">>({
		initialValues: {
			token: "",
			url: "",
		},
		validate: {
			token: (value) => {
				if (value.length === 0) {
					return "Token is required";
				}
			},
			url: (value) => {
				if (value.length === 0) {
					return "URL is required";
				}
			},
		},
	});

	const [checkAccount, setCheckAccount] =
		useState<InferMutationOutput<"canvas-info.verify-info"> | null>(null);

	const submitToken = () => {
		form.validateField("token");
		if (form.values.token.length < 1) {
			return;
		}
		setStepperPage(1);
	};

	const submitUrl = () => {
		const validate = form.validateField("url");
		if (validate.hasError) {
			return;
		}
		setStepperPage(2);
		validateConnection();
	};

	const validateConnection = () => {
		connectMutation.mutate(
			{
				token: form.values.token,
				url: `https://${form.values.url}.instructure.com`,
			},
			{
				onSuccess: (result) => {
					setCheckAccount(result);
					console.log("Setting cookie to ", result.jwt);
					setCookie("jwt", result.jwt, {
						// 20 days
						expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
					});
					trpcClient.invalidateQueries("theme-and-settings");
				},
				onError: (error) => {
					console.log(error);
				},
			}
		);
	};

	const restartProcess = () => {
		setStepperPage(0);
		form.setValues({
			token: "",
			url: "",
		});
	};

	const [stepperPage, setStepperPage] = useState(0);

	const disconnectMutation = trpc.useMutation("canvas-info.disconnect-account");
	const disconnectAccount = () => {
		disconnectMutation.mutate(undefined, {
			onSuccess: (data) => {
				console.log(data);
				setCookie("jwt", data.jwt);
				trpcClient.invalidateQueries("theme-and-settings");
			},
		});
	};

	if (user?.canvasAccount && stepperPage === 0) {
		return (
			<Stack align="flex-start">
				<Title order={2}>Connect Canvas LMS Account</Title>
				<Text>You are already connected to Canvas</Text>
				<Button
					loading={disconnectMutation.status === "loading"}
					onClick={disconnectAccount}
					color={"red"}
				>
					Disconnect Account
				</Button>
			</Stack>
		);
	}

	return (
		<>
			<Title order={2}>Connect Canvas LMS Account</Title>
			<Stepper breakpoint="sm" m="md" size="sm" mt="xl" active={stepperPage}>
				<Stepper.Step label="Create Token" icon={<LockAccess />}>
					<Stack align="center" sx={{ maxWidth: 500, margin: "auto" }}>
						<TextInput
							{...form.getInputProps("token")}
							wrapperProps={{
								sx: {
									width: "100%",
								},
							}}
							label="Token"
						/>
						<Button
							disabled={form.values.token.length < 12}
							onClick={submitToken}
						>
							{" "}
							Next{" "}
						</Button>
					</Stack>
				</Stepper.Step>
				<Stepper.Step label="Enter School URL" icon={<LinkIcon />}>
					<Stack align="center" sx={{ maxWidth: 500, margin: "auto" }}>
						<Group spacing={2}>
							<Text>https://</Text>
							<Box sx={{ textAlign: "center" }}>
								<TextInput
									size="sm"
									variant="light"
									sx={(theme) => ({
										borderBottom: `1px solid ${theme.colors.gray[4]}`,
										display: "grid",
										textAlign: "inherit",
										width: 50,
										padding: 0,
										margin: 0,
									})}
									{...form.getInputProps("url")}
								/>
							</Box>
							<Text>.instructure.com</Text>
						</Group>
						<Button disabled={form.values.url.length === 0} onClick={submitUrl}>
							Next
						</Button>
					</Stack>
				</Stepper.Step>
				<Stepper.Step label="Verify Info" icon={<Check />}>
					<Center>{connectMutation.status === "loading" && <Loader />}</Center>
					{connectMutation.status === "error" && (
						<Stack align="center">
							<Text color="red">
								There was an error connecting your account
							</Text>
							<Button variant="light" onClick={restartProcess}>
								Restart
							</Button>
						</Stack>
					)}
					{connectMutation.status === "success" && (
						<Stack align="center">
							<Text>Successfully Connected Your Account</Text>
							<Link href="/classes">
								<Button variant="subtle">Link My Classes</Button>
							</Link>
						</Stack>
					)}
				</Stepper.Step>
			</Stepper>
		</>
	);
}

import {
	Button,
	Center,
	Loader,
	Stack,
	Stepper,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { setCookie } from "cookies-next";
import { useContext, useState } from "react";
import { Check, Link, LockAccess } from "tabler-icons-react";
import {
	InferMutationInput,
	InferMutationOutput,
	trpc,
} from "../../utils/trpc";
import { UserContext } from "../_app";

export default function CanvasConnectPage() {
	const connectMutation = trpc.useMutation("canvas.verify-info", {
		ssr: false,
	});

	const trpcClient = trpc.useContext();
	const user = useContext(UserContext);

	const form = useForm<InferMutationInput<"canvas.verify-info">>({
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
		useState<InferMutationOutput<"canvas.verify-info"> | null>(null);

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
		connectMutation.mutate(form.values, {
			onSuccess: (result) => {
				setCheckAccount(result);
				console.log("Setting cookie to ", result.jwt);
				setCookie("jwt", result.jwt, {
					maxAge: 60 * 60 * 24 * 365,
				});
				trpcClient.invalidateQueries("theme-and-settings");
			},
			onError: (error) => {
				console.log(error);
			},
		});
	};

	const restartProcess = () => {
		setStepperPage(0);
		form.setValues({
			token: "",
			url: "",
		});
	};

	const [stepperPage, setStepperPage] = useState(0);

	const disconnectMutation = trpc.useMutation("canvas.disconnect-account");
	const disconnectAccount = () => {
		disconnectMutation.mutate(undefined, {
			onSuccess: (data) => {
				console.log(data);
				setCookie("jwt", data.jwt);
				trpcClient.invalidateQueries("theme-and-settings");
			},
		});
	};

	if (user?.canvasAccount) {
		return (
			<Stack align="flex-start">
				<Title order={2}>Connect Canvas LMS Account</Title>
				<Text>You are already connected to Canvas</Text>
				<Button onClick={disconnectAccount} color={"red"}>
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
						<Button onClick={submitToken}> Submit </Button>
					</Stack>
				</Stepper.Step>
				<Stepper.Step label="Enter School URL" icon={<Link />}>
					<Stack align="center" sx={{ maxWidth: 500, margin: "auto" }}>
						<TextInput
							{...form.getInputProps("url")}
							wrapperProps={{
								sx: {
									width: "100%",
								},
							}}
							label="School URL"
						/>
						<Button onClick={submitUrl}> Submit </Button>
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
							<Text color="green">{checkAccount?.account?.name}</Text>
						</Stack>
					)}
				</Stepper.Step>
			</Stepper>
		</>
	);
}

import { Space } from "@mantine/core";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FocusContext } from "../../contexts/FocusContext";

export default function FocusModeContentSpacer() {
	const { focusState } = useContext(FocusContext);
	const router = useRouter();
	if (focusState.task && !router.pathname.includes("focus")) {
		return <Space w="xl" h={110} />;
	} else {
		return null;
	}
}

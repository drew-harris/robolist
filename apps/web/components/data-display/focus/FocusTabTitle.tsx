import Head from "next/head";
import { useContext } from "react";
import { FocusContext } from "../../../contexts/FocusContext";
import { secondToTimeDisplay } from "../../../utils/client";

export default function FocusTabTitle() {
	const { focusState, fn: focusFn } = useContext(FocusContext);
	if (focusState.working && focusState.task) {
		return (
			<Head>
				<title>
					{secondToTimeDisplay(focusState.secondsElapsed) +
						" • " +
						focusState?.task?.title}
				</title>
			</Head>
		);
	}
	return null;
}

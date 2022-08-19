import Head from "next/head";
import { useContext } from "react";
import {
	FocusContext,
	SecondsElapsedContext,
} from "../../../contexts/FocusContext";
import { secondToTimeDisplay } from "../../../utils/client";

export default function FocusTabTitle() {
	const { focusState, fn: focusFn } = useContext(FocusContext);
	const secondsElapsed = useContext(SecondsElapsedContext);
	if (focusState.working && focusState.task) {
		return (
			<Head>
				<title>
					{secondToTimeDisplay(secondsElapsed) +
						" • " +
						focusState?.task?.title}
				</title>
			</Head>
		);
	}
	return null;
}

import { Tabs } from "@mantine/core";
import { useState } from "react";
import useUser from "../../hooks/useUser";
import LinkAccountPrompt from "../small/LinkAccountPrompt";
import CanvasNewTaskModal from "./CanvasNewTaskModal";
import NewCustomTaskModal from "./NewCustomTaskModal";

export default function GeneralNewTaskModal() {
	const user = useUser();
	const [tabValue, setTabValue] = useState<string | null>(
		user?.canvasAccount ? "canvas" : "custom"
	);
	return (
		<Tabs value={tabValue} onTabChange={setTabValue}>
			<Tabs.List>
				<Tabs.Tab value="canvas">Canvas</Tabs.Tab>
				<Tabs.Tab value="custom">Custom</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="canvas">
				{user?.canvasAccount ? <CanvasNewTaskModal /> : <LinkAccountPrompt />}
			</Tabs.Panel>
			<Tabs.Panel value="custom">
				<NewCustomTaskModal />
			</Tabs.Panel>
		</Tabs>
	);
}

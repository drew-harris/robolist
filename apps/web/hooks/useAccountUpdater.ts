import { setCookie } from "cookies-next";
import { useEffect } from "react";
import { trpc, vanilla } from "../utils/trpc";

export default function useAccountUpdater() {
	const trpcClient = trpc.useContext();
	useEffect(() => {
		const update = async () => {
			try {
				const jwt = await vanilla.mutation("canvas-info.account-update");
				if (jwt == null) {
					return;
				}
				setCookie("jwt", jwt, {
					// 20 days
					expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
				});
				trpcClient.refetchQueries(["theme-and-settings"]);
			} catch (error) {}
		};
		update();
	}, [trpcClient]);
}

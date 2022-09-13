import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";

interface useSkeletonCountProps {
	key: string;
	group: any[] | undefined | null;
}

export default function useSkeletonCount(
	key: string,
	group: any[] | undefined | null
) {
	const [count, updateCount] = useLocalStorage<number>({
		key: `sk-${key}`,
		defaultValue: 0,
	});

	useEffect(() => {
		if (!group) return;
		const newNum = group?.length || 0;
		if (newNum !== count) {
			updateCount(newNum);
		}
		/* eslint-disable */
	}, [group]);

	return count;
}

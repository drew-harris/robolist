import { useContext } from "react";
import { UserContext } from "../pages/_app";

export default function useUser() {
	const user = useContext(UserContext);
	return user;
}

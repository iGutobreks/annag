import { ReactElement, ReactNode } from "react";
import "../../../../dist/output.css";

export const Button: React.FC<{txt?: string, func: () => void, isChoosed?: boolean, icon?: ReactNode }> = ({ txt, func, isChoosed, icon }) => {
	/* sidebar buttons */
	return (
		<button className={`${isChoosed ? "bg-lime-600 textg" : "bg-zinc-800 text-gray-300"} flex text-3xl h-10 w-32 justify-center items-center`} onClick={func}>
			{txt ? txt : icon}
		</button>
	);
}
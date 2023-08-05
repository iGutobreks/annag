import { ReactElement, useEffect, useState } from "react";
import "./visualizer/checkbox.css";
import "../../../styles.css";

export interface C_ReturnData {
	checkbox: JSX.Element,
	retValue: boolean,
}

export function Checkbox({extern_value, func, data, region, index}: {extern_value: boolean, func: VoidFunction, data: Object, region: string, index: number}): C_ReturnData {
	const [active, setActive] = useState<boolean>(extern_value);

	let name: string = "checkbox" + index;
	useEffect(() => { /*change checkbox value every time active change*/
		localStorage.setItem(region, JSON.stringify({
			...data,
			[name]: active,
		}));
	}, [active]);

	return {
		checkbox: (
			<div>
				<div className={!active ? "checkbox checkbox-active" : "checkbox"} onClick={
					() => {
						setActive((prevState) => !prevState);
						func();
				}
				}>
				</div>
			</div>
		),
		retValue: active,
	}; 
}
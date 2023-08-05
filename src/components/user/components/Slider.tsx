import { useEffect, useState } from "react";
import "../../../../dist/output.css";
import "./visualizer/slider.css";

export interface ReturnData {
	slider: JSX.Element;
	retValue: number;
}

export function Slider({extern_value, data, region, index}: {extern_value: number; data: Object; region: string, index: number}): ReturnData {
	const [value, setValue] = useState<number>(extern_value);

	let name:string = "slider_value" + index;
	useEffect(() => {
		localStorage.setItem(region, JSON.stringify( /*change value of the slider every time value change*/
			{
				...data,
				[name]: value,
			}
		));
	}, [value])

	const returnData: ReturnData = {
		slider: (
			<div>
				<div className="flex justify-between">
		    </div>
		      <div className="slider">
          <input type="range" min="0" max="100" value={value} className="slider-input" onChange={(e) => setValue(+e.target.value)} />
          <div className="fill" style={{ "width": `${value}%` }}></div>
		   	</div>
	   	</div>
		),
		retValue: value,
	};

	return returnData;
}
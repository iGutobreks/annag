import { useEffect, useState } from "react";
import { BReach, BAutoclicker, BVelocity, BBhop, BSpeed, BMegajump } from "../../call/call.js";
import { Slider, Button, Checkbox } from "../index.js";
import unique from "./unique/components.js";
import { baseButton } from "./unique/components.js";
import "./slider.css";
import "./checkbox.css";

let tick = {
	tick_page1: 0,
	tick_page2: 0,
};

function impl_tick(tick_down: "tick_page1" | "tick_page2") {
	tick[tick_down] += 1; /*increment on tick*/
}

///
/// first page
/// 
export function View_pageOne() {
	const [selectedPage, setSelectedpage] = useState<string>("reach");
	const [title, setTitle] = useState<string>("Minecraft 1.8.9");

	const DATA = JSON.parse(localStorage.getItem("page1")!); /*get old stringfy in hardware*/

	let unq = new unique({quantity_slider: 3, quantity_button: 3, func_button: [() => change_value(), () => autoclicker(), () => velocity()], region: "page1"}); /*create instace of unique*/
	let {extern_slider, extern_button} = unq.get_values(); /*get all data for components*/

	let DESIGN = unq.design(extern_slider, extern_button, tick.tick_page1); /*components array easy*/

	if (DATA == null) {
		localStorage.setItem(
			"page1", 
			JSON.stringify(
				`${DESIGN.b_slider}, ${DESIGN.b_button}`,
			)
		);
	}

	let slider_item = unq.render_Slider(DESIGN.b_slider);
	let checkbox_item = unq.render_Checkbox(DESIGN.b_button);

	///
	/// sucked function to render screen
	/// 
	function view() {
		if (selectedPage == "reach") {
			return (
				<div className="flex flex-col gap-3">
					<div className="flex gap-1">
						{checkbox_item[0].checkbox}
						<h1 className="text-3xl">{selectedPage}</h1>
					</div>
					<div>
						{[0, 1].map((i) => {
							let slider = slider_item[i];
							return(
								<div key={i} className="flex flex-col">
									<div className="flex flex-row justify-between">
										{((slider.retValue / 100 - 1) + 4).toFixed(2)}
										{i == 0 ? <p>max-value</p> : <p>min-value</p>}
									</div>
									{slider.slider}
								</div>
							)
						})}
					</div>
				</div>
			);
		} else if(selectedPage == "autoclicker") {
			return (
				<div className="flex flex-col gap-3">
					<div className="flex gap-1">
						{checkbox_item[1].checkbox}
						<h1 className="text-3xl">{selectedPage}</h1>
					</div>
					<div className="flex flex-col">
						<div className="flex flex-row justify-between">
						{Math.abs((slider_item[2].retValue / 100) * 20).toFixed(2)}
						<p>cps</p>
					</div>
						{slider_item[2].slider}
						<input type="text" placeholder="Minecraft 1.8.9" className="bg-zinc-900 border-none text-slate-300 focus:outline-none" onChange={((e) => setTitle(e.target.value))}/>
					</div>
				</div>
			);
		}
		return (
			<div className="flex flex-row gap-3">
				{checkbox_item[2].checkbox}
				<h1 className="text-3xl">{selectedPage}</h1>
			</div>
		);
	}

	function change_value() {
		if(checkbox_item[0].retValue) {
			BReach({
				min: +((slider_item[1].retValue / 100 - 1) + 4).toFixed(2), 
				max: +((slider_item[0].retValue / 100 - 1) + 4).toFixed(2)
			});
		}
	}

	function autoclicker() {
		BAutoclicker({
			cps: +((slider_item[2].retValue / 100) * 20).toFixed(2),
			title,
			enable: checkbox_item[1].retValue,
		});
	}

	function velocity() {
		BVelocity({enable: checkbox_item[2].retValue});
	}

	impl_tick("tick_page1");
	useEffect(() => {
		console.log(localStorage.getItem("page1")!);
		unq.re_design({tick: tick.tick_page1});
	}, [DATA])

	return (
		<div className="flex flex-col w-96 h-96 gap-10">
			<div>
				<ul className="flex flex-row justify-between cursor-pointer">
					<li className={selectedPage == "reach" ? "border-2 border-b-lime-600 border-transparent text-slate-300" : "text-slate-600"} onClick={() => setSelectedpage("reach")}>reach</li>
					<li className={selectedPage == "autoclicker" ? "border-2 border-b-lime-600 border-transparent text-slate-300" : "text-slate-600"} onClick={() => setSelectedpage("autoclicker")}>autoclicker</li>
					<li className={selectedPage == "velocity" ? "border-2 border-b-lime-600 border-transparent text-slate-300" : "text-slate-600"} onClick={() => setSelectedpage("velocity")}>velocity</li>
				</ul>
			</div>
			{view()}
		</div>
	);
}

///
/// secound page
/// 
export function View_pageTwo() {
	const DATA = JSON.parse(localStorage.getItem("page2")!);

	let unq = new unique({quantity_slider: 0, quantity_button: 3, func_button: [() => bhop(), () => speed(), () => megajump()], region: "page2"});
	let {extern_slider, extern_button} = unq.get_values();

	let DESIGN = unq.design(extern_slider, extern_button, tick.tick_page2);

	if (DATA == null) {
		localStorage.setItem(
			"page2",
			JSON.stringify(
				`${DESIGN.b_slider}, ${DESIGN.b_button}`
			)
		);
	}

	let checkbox_item = unq.render_Checkbox(DESIGN.b_button);

	function bhop() {
		BBhop({enable: checkbox_item[0].retValue});
	}

	function speed() {
		BSpeed({enable: checkbox_item[1].retValue});
	}

	function megajump() {
		BMegajump({enable: checkbox_item[2].retValue});
	}

	impl_tick("tick_page2");
	useEffect(() => {
		unq.re_design({tick: tick.tick_page2});
	}, [DATA])

	return (
		<div className="w-96 h-96">
			<div className="flex flex-col gap-3">
				<h1 className="text-3xl">movement</h1>
					<div className="flex flex-row gap-2">
						{checkbox_item[0].checkbox}
						<p>bhop</p>
					</div>
					<div className="flex flex-row gap-2">
						{checkbox_item[1].checkbox}
						<p>speed</p>
					</div>
					<div className="flex flex-row gap-2">
						{checkbox_item[2].checkbox}
						<p>megajump</p>
				</div>
			</div>
		</div>
	);
}

///
/// last page
/// 
export function View_pageThree() {
	return (
		<div className="w-96 h-96">
			<h1 className="text-3xl">credits: <a href="https://github.com/igutobreks/">github</a></h1>
		</div>
	);
}

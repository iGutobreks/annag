// compressible slider history, value and context.

import { ReactElement, useState } from "react";
import { ReturnData, Slider } from "../../Slider.js";
import { C_ReturnData, Checkbox } from "../../Checkbox.js";
import { once } from "events";

interface baseSlider {
	[index: number]: {
		extern_value: number,
		data: {
			[name: string]: any
		},
	}
}

export interface baseButton {
	[index: number]: {
		extern_value: boolean,
		data: {
			[name: string]: any
		}
	}
}

export default class components {
	quantity_slider: number;
	quantinty_button: number;
	readonly func_button!: VoidFunction[];
	readonly region!: string;

	//
	// set values in instance
	//
	constructor({quantity_slider, quantity_button, func_button, region}: {quantity_slider: number, quantity_button: number, func_button: VoidFunction[], region: string}) {
		this.quantity_slider = quantity_slider;
		this.quantinty_button = quantity_button;
		this.func_button = func_button;
		this.region = region;
	}

	//
	// get values of last closed program state
	//
	get_values(): {extern_slider: Array<number>, extern_button: Array<boolean>} {
		let item = JSON.parse(localStorage.getItem(this.region)!); /*get a stringfy in hardware, and parse it for json. Is necessary in future.*/

		if (item == null) {
			localStorage.setItem(
				this.region, 
				JSON.stringify(
					this.design([1,1,1], [false,false,false], 0)
				)
			);
		} /*anticrash in case of new user*/

		let values: Array<number> = [];
		for (let i = 0; i < this.quantity_slider; i++) {
			let name:string = "slider_value" + i;
			if (item[name] == undefined) {
				localStorage.setItem(this.region, JSON.stringify({...item, [name]: 1}));
			} 

			values.push(
				item[name]
			);
		}

		let state: Array<boolean> = [];
		for (let i = 0; i < this.quantinty_button; i++) {
			let name:string = "checkbox" + i;
			if (item[name] == undefined) {
				localStorage.setItem(this.region, JSON.stringify({...item, [name]: true}));
			}

			state.push(item[name]);
		}

		return {extern_slider: values, extern_button: state}; 
	}

	//
	// order all components with your respectivy data
	//
	design(extern_slider: number[], extern_button: boolean[], tick: number): {b_slider: baseSlider, b_button: baseButton} {
		let out_design: {b_slider: baseSlider, b_button: baseButton} = {b_slider: {}, b_button: {}};
		for (let i = 0; i < this.quantity_slider; i++) {
			let name = "slider_value" + i;
			out_design.b_slider = {
				[i]: {
					extern_value: extern_slider[i],
					data: {
						...JSON.parse(localStorage.getItem(this.region)!),
					}
				},
				...out_design.b_slider,
			}
		}

		for (let i = 0; i < this.quantinty_button; i++) {
			let name = "checkbox" + i;
			if (tick < 3) { /*disable checkbox on the once-time openning program*/
					out_design.b_button = {
					[i]: {
						extern_value: true,
						data: {
							...JSON.parse(localStorage.getItem(this.region)!),
						}
					},
					...out_design.b_button,
				}
			} else {
					out_design.b_button = {
					[i]: {
						extern_value: extern_button[i],
						data: {
							...JSON.parse(localStorage.getItem(this.region)!),
						}
					},
					...out_design.b_button,
				}
			}
			
		}

		return out_design; /*callback back old components states*/
	}

	//
	// create an array with component slider and render slider in screen
	//
	render_Slider(base: baseSlider): Array<ReturnData> {
		let sliders: ReturnData[] = [];

		for(let i = 0; i < this.quantity_slider; i++) {
			sliders[i] = Slider({extern_value: base[i].extern_value, data: base[i].data, region: this.region, index: i}); /*stack in array of ReturnData interface, and stack slider*/
		}

		return sliders;
	}

	//
	// create an array with component checkbox and render checkbox in screen
	//
	render_Checkbox(base: baseButton): Array<C_ReturnData> {
		let checkboxs: C_ReturnData[] = [];

		for(let i = 0; i < this.quantinty_button; i++) {
			checkboxs[i] = Checkbox({extern_value: base[i].extern_value, func: this.func_button[i], data: base[i].data, region: this.region, index: i}) /*stack in array of ReturnData interface, and stack button*/
		}

		return checkboxs;
	}

	//
	// save the state on screen update
	//
	re_design({tick}: {tick: number}): void {
		let item: {[name: string]: number | boolean} = {};
		for (let i = 0; i < this.get_values().extern_slider.length; i++) {
			let name: string = "slider_value" + i;
			item = {...item, [name]: this.get_values().extern_slider[i]};
		}

		for (let i = 0; i < this.get_values().extern_button.length; i++) {
			let name:string = "checkbox" + i;
			if (tick <= 3) { /*disable checkbox on the once-time openning program*/
				item = {...item, [name]: true};
			} else {
				item = {...item, [name]: this.get_values().extern_button[i]};
			}
		}

		localStorage.setItem(this.region, JSON.stringify(item)); /*alock in hardware new state of components*/
	}
}

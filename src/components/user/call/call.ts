import { invoke } from "@tauri-apps/api/tauri";

export async function BReach({min, max}: {min: number, max: number}): Promise<void> {
	await invoke("enable_reach", { min, max });
}

export async function BAutoclicker({cps, title, enable}: {cps: number, title: string, enable: boolean}): Promise<void> {
	await invoke("enable_autoclicker", { cps, title, enable });
}

export async function BVelocity({enable}: {enable: boolean}): Promise<void> {
	await invoke("enable_velocity", { enable });
}

export async function BBhop({enable}: {enable: boolean}): Promise<void> {
	await invoke("enable_bhop", { enable });
}

export async function BSpeed({enable}: {enable: boolean}): Promise<void> {
	await invoke("enable_speed", { enable });
}

export async function BMegajump({enable}: {enable: boolean}): Promise<void> {
	await invoke("enable_megajump", { enable });
}
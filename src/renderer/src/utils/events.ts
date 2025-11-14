import { apiJson } from "./api";

interface EventHeaders {
	id?: string;
	user?: string;
	type?: string;
	event?: string;
	app_id?: string;
	app_name?: string;
	update?: string;
	updatedata?: string;
}

async function sendEvent(headers: EventHeaders) {
	try {
		const data = await apiJson<{ id?: string; error?: string }>(
			"/db/events",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
			},
		);
		if (data.id) {
			console.log(`Event sent with ID: ${data.id}`);
			return data;
		}
		console.error(`Failed to send event: ${data.error ?? "Unknown error"}`);
		return "error";
	} catch (error) {
		console.error("Failed to send event", error);
		return "error";
	}
}

export default sendEvent;

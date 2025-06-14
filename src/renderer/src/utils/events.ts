import { getCurrentPort } from "./getPort";

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
	const port = await getCurrentPort();
	const response = await fetch(`http://localhost:${port}/db/events`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	});
	const data = await response.json();
	if (response.ok && response.status === 200) {
		console.log(`Event sent with ID: ${data.id}`);
		return data;
	}
	console.error(`Failed to send event: ${data.error}`);
	return "error";
}

export default sendEvent;

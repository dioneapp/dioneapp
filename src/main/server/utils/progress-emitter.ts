import type { Server } from "socket.io";

export type RunProgressEvent =
	| { type: "run_started"; runId: string; totalSteps: number; steps: { id: string; label: string; weight: number }[] }
	| { type: "step_started"; runId: string; id: string }
	| { type: "step_progress"; runId: string; id: string; progress: number }
	| { type: "step_finished"; runId: string; id: string }
	| { type: "run_finished"; runId: string; success: boolean };

export function emitRunProgress(io: Server, roomId: string, event: RunProgressEvent) {
	io.to(roomId).emit("run_progress", event);
}

export function generateRunId(prefix: string) {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

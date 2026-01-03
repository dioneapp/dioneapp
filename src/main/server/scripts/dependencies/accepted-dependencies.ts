import * as build_tools from "./files/build-tools";
import * as conda from "@/server/scripts/dependencies/files/conda";
import * as cuda from "@/server/scripts/dependencies/files/cuda";
import * as ffmpeg from "@/server/scripts/dependencies/files/ffmpeg";
import * as git from "@/server/scripts/dependencies/files/git";
import * as node from "@/server/scripts/dependencies/files/node";
import * as ollama from "@/server/scripts/dependencies/files/ollama";
import * as pnpm from "@/server/scripts/dependencies/files/pnpm";
import * as uv from "@/server/scripts/dependencies/files/uv";
import type { Server } from "socket.io";

export const dependencyRegistry: Record<
	string,
	{
		isInstalled: (binFolder: string) => Promise<{
			installed: boolean;
			reason: string;
			version?: string;
		}>;
		install: (
			binFolder: string,
			id: string,
			io: Server,
			required_v?: string,
		) => Promise<{ success: boolean }>;
		uninstall: (binFolder: string) => Promise<void>;
	}
> = {
	git,
	conda,
	uv,
	ffmpeg,
	node,
	pnpm,
	build_tools,
	cuda,
	ollama,
};

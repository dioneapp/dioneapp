import * as build_tools from "@/server/scripts/dependencies/files/build_tools";
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
		}>;
		install: (
			binFolder: string,
			id: string,
			io: Server,
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

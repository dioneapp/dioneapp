import fs from "fs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import type { Server } from "socket.io";

export async function useGit(
	command: string,
	workingDir: string,
	io: Server,
	id: string,
) {
	const isCloneCommand = command.includes("git clone");

	if (isCloneCommand) {
		const args = command.replace("git clone", "").trim().split(/\s+/);
		let url: string | undefined;
		let folder: string | undefined;
		let branch: string | undefined;

		// search for url
		const urlRegex = /^(https?:\/\/|git@)[^\s]+(?:\.git)?\/?$/;
		for (let i = 0; i < args.length; i++) {
			if (urlRegex.test(args[i])) {
				url = args[i];
				// the folder is the next argument (if it exists and is not a flag)
				if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
					folder = args[i + 1];
				}
				break;
			}
		}

		// search for branch
		const branchIndex = args.findIndex(
			(arg) => arg === "--branch" || arg === "-b",
		);
		if (branchIndex !== -1 && branchIndex + 1 < args.length) {
			branch = args[branchIndex + 1];
		}

		// clone the repository
		io.to(id).emit("installUpdate", {
			type: "log",
			content: `Cloning repository ${url} ${folder ? `to ${workingDir}/${folder}` : ""}${branch ? ` on branch ${branch}` : ""}`,
		});

		let lastError: any = null;
		let refToTry = branch ? branch : "main";
		let result = false;

		for (let attempt = 0; attempt < 2; attempt++) {
			try {
				await git.clone({
					fs,
					http,
					dir: `${workingDir}/${folder}`,
					url: url!,
					singleBranch: true,
					ref: refToTry,
					batchSize: 3,
					onProgress: (progress) => {
						io.to(id).emit("installUpdate", {
							type: "log",
							content: `Cloning repository... ${progress.loaded}/${progress.total !== undefined ? progress.total : progress.loaded}`,
						});
					},
				});
				result = true;
				break;
			} catch (err: any) {
				lastError = err;
				if (
					!branch &&
					refToTry === "main" &&
					attempt === 0 &&
					(err.message?.includes("not found") ||
						err.message?.includes("does not exist") ||
						err.message?.includes("Could not find"))
				) {
					io.to(id).emit("installUpdate", {
						type: "log",
						content: `Branch 'main' not found, trying 'master'...`,
					});
					refToTry = "master";
					continue;
				} else {
					break;
				}
			}
		}

		if (!result) {
			io.to(id).emit("installUpdate", {
				type: "error",
				content: `Failed to clone repository: ${lastError?.message || lastError}`,
			});
			throw lastError;
		}

		return true;
	}

	return false;
}

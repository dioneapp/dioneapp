import { openLink } from "@renderer/utils/openLink";
import { useEffect } from "react";

export default function NoAccess() {

useEffect(() => {
		function checkAccess() {
			const user = localStorage.getItem("dbUser");
			if (user) {
				const dbUser = JSON.parse(user);
				if (dbUser[0].tester === true) {
					window.location.href = "/";
				}
			} else {
				window.location.href = "/login";
			}
		}

		checkAccess();	
	}, []);

	function logout() {
		localStorage.clear();
		window.location.reload();
	}

	return (
		<section className="absolute w-screen h-screen inset-0 z-50 bg-[#080808] overflow-hidden">
			<div className="p-4 h-full w-full">
				<div className="flex flex-col justify-center items-center mt-auto h-full">
					<h1 className="text-4xl font-semibold mb-4">
						Join Dione whitelist
					</h1>
					<p className="text-neutral-400 text-balance text-center max-w-xl">
					Dione is under construction and only a limited amount of users can access it, join our whitelist now to get access to future versions of our app.
					</p>
					<div className="flex gap-2 mt-6">
						<button className="bg-white hover:opacity-80 transition-opacity duration-300 rounded-full px-10 py-2 text-sm font-semibold text-black cursor-pointer" onClick={() => openLink("https://getdione.app/beta/join")} type="button">
							Join
						</button>
						<button  className="border border-white/10 hover:bg-white/10 transition-colors duration-300 rounded-full px-8 py-2 text-sm font-medium text-neutral-400 cursor-pointer" onClick={() => logout()} type="button">
							Logout
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
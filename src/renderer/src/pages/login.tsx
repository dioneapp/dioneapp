import { Link } from "react-router-dom";

export default function Login() {
	return (
        <section className="absolute w-screen h-screen inset-0 z-50 bg-[#080808] overflow-hidden">
            <div className="p-4 h-full w-full">
                <div className="flex flex-col justify-center items-center mt-auto h-full">
                    <h1 className="text-2xl font-semibold mb-4">
                        Dione is under construction
                    </h1>
                    <p className="text-neutral-400 text-balance text-center max-w-xl">
                        Right now only a list of users can access, please login to check if you are on the list.
                    </p>
                    <Link to="/first-time" className="bg-white text-black px-8 text-sm font-semibold py-2 rounded-full mt-6">Login</Link>
                </div>
            </div>

        </section>
    );
}
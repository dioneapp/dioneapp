import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCurrentPort } from "../utils/getPort";
import Loading from "./loading";
import { io } from "socket.io-client";

export default function Install() {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any | undefined>(undefined);
    const [logs, setLogs] = useState<string[]>([]);
    const { id } = useParams<{ id: string }>();

    // Fetch script data
    useEffect(() => {
        async function getData() {
            try {
                const port = await getCurrentPort();
                const response = await fetch(`http://localhost:${port}/search/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const script = await response.json();
                console.log("script retrieved:", script);
                setData(script[0]);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLogs((prevLogs) => [...prevLogs, "Error fetching script data"]);
            }
        }

        getData();
    }, [id]);

    // Set up socket connection
    useEffect(() => {
        async function setupSocket() {
            const port = await getCurrentPort();
            const socket = io(`http://localhost:${port}`);

            socket.on("clientUpdate", (message: string) => {
                console.log("Received log:", message);
                setLogs((prevLogs) => [...prevLogs, message]);
            });

            socket.on("connect", () => {
                console.log("Connected to socket:", socket.id);
                setLogs((prevLogs) => [...prevLogs, "Socket connected"]);
            });

            socket.on("disconnect", () => {
                console.log("Socket disconnected");
                setLogs((prevLogs) => [...prevLogs, "Socket disconnected"]);
            });

            socket.on("installUpdate", (message: string) => {
                console.log("Received action update:", message);
                setLogs((prevLogs) => [...prevLogs, message]);
            });

            return () => {
                socket.disconnect();
            };
        }

        setupSocket();
    }, []);

    // Trigger download
    async function download() {
        try {
            const port = await getCurrentPort();
            await fetch(`http://localhost:${port}/download/${id}`, {
                method: "GET",
            });
        } catch (error) {
            console.error("Error initiating download:", error);
            setLogs((prevLogs) => [...prevLogs, "Error initiating download"]);
        }
    }

    return (
        <div className="flex flex-col items-start justify-start p-8 h-screen w-screen">
            {loading ? (
                <Loading />
            ) : (
                <div className="flex flex-col gap-2 w-full h-full">
                    <div className="flex gap-4">
                        <p className="font-semibold">Download {data?.name}?</p>
                        <div className="flex gap-4">
                            <button onClick={download}>yes</button>
                            <a href="/">no</a>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-300">
                        link: <span className="select-all">{data?.script_url}</span>
                    </p>
                    <div className="mt-24 w-full h-full border bg-neutral-800">
                        <div className="flex flex-col gap-2 w-full h-full overflow-auto p-4">
                            {logs.map((log, index) => (
                                <p className="text-xs text-neutral-300" key={index}>
                                    {log || "loading"}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

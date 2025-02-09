"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
	const [data, setData] = useState<{ message: string } | null>(null);

	async function fetchTestData() {
		try {
			const res = await fetch("http://127.0.0.1:8000/test", {
				method: "GET",
				credentials: "include" // Include credentials if needed
			});
			const result = await res.json();

			setData(result);
		} catch (error) {
			setData({ message: "Error fetching data: " + error });
		}
	}

	useEffect(() => {
		fetchTestData();
	}, []);

	return (
		<div>
			<h1 className="text-xl font-bold">Data from FastAPI test endpoint:</h1>
			{data ? <p className="text-blue-500">{data.message}</p> : <p>Loading...</p>}
		</div>
	);
}

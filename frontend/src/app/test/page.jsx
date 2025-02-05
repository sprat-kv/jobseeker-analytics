"use client";

import { useState, useEffect } from "react";

export default function Home() {
	const [data, setData] = useState(null);

	useEffect(() => {
		fetch("http://127.0.0.1:8000/")
			.then((res) => res.json())
			.then((data) => setData(data))
			.catch((err) => console.error("Error fetching:", err));
	}, []);

	test = 0;

	return (
		<div>
			<h1>Next.js + FastAPI</h1>
			<p>{data ? data.message : "Loading..."}</p>
		</div>
	);
}

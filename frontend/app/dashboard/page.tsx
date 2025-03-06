"use client";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { DatePicker } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";

export default function Dashboard() {
	const [showModal, setShowModal] = useState(true);
	const [startDate, setStartDate] = useState<CalendarDate | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchStartDate = async () => {
			try {
				const response = await fetch("/api/get-start-date");
				const data = await response.json();
				if (data.start_date) {
					const parsedDate = parseDate(data.start_date);
					setStartDate(parsedDate);
					setShowModal(false);
				}
			} catch (error) {
				console.error("Error fetching start date:", error);
			}
		};

		fetchStartDate();
	}, []);

	const fetchEmails = async () => {
		try {
			await fetch("/api/fetch-emails", { method: "POST" });
		} catch (error) {
			console.error("Error fetching emails:", error);
		}
	};

	const handleConfirm = async () => {
		setShowModal(false);
		await fetchEmails();
		await fetch("/api/save-start-date", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ start_date: startDate?.toString() })
		});
		router.replace("/processing");
	};

	return (
		<div className="flex flex-col items-center justify-center text-center pt-64">
			{/* Modal */}
			<Transition appear as={Fragment} show={showModal}>
				<Dialog as="div" className="relative z-50" onClose={() => setShowModal(false)}>
					<div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
					<div className="fixed inset-0 flex items-center justify-center">
						<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
							<h2 className="text-xl font-semibold text-black">
								Please enter the start date of your current job search:
							</h2>
							<DatePicker
								className="mt-4 w-full p-2 border rounded-lg"
								value={startDate}
								onChange={(date) => setStartDate(date as CalendarDate)}
							/>
							<button
								className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
								onClick={handleConfirm}
							>
								Confirm
							</button>
						</div>
					</div>
				</Dialog>
			</Transition>

			{/* Dashboard */}
			{!showModal && (
				<>
					<h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>
					<p className="pt-8">Your job search start date: {startDate ? startDate.toString() : "Not set"}</p>
				</>
			)}
		</div>
	);
}
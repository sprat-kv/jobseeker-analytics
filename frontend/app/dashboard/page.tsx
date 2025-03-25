"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	DatePicker,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { CalendarDate } from "@internationalized/date";
import React from "react";

import JobApplicationsDashboard, { Application } from "@/components/JobApplicationsDashboard";
import { checkAuth } from "@/utils/auth";

interface SessionData {
	start_date?: string;
}
// Load sort key from localStorage or use default "Sort By"
const storedSortKey =
	typeof window !== "undefined" ? localStorage.getItem("sortKey") || "Date (Newest)" : "Date (Newest)";

export default function Dashboard() {
	const [showModal, setShowModal] = useState(false);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
	const [sessionData, setSessionData] = useState<SessionData | null>(null);
	const router = useRouter();
	const [data, setData] = useState<Application[]>([]);
	const [loading, setLoading] = useState(true);
	const [downloading, setDownloading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sortedData, setSortedData] = useState<Application[]>([]);
	const [selectedKeys, setSelectedKeys] = useState(new Set([storedSortKey]));
	const [isNewUser, setIsNewUser] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; 

	const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(", ").replace(/_/g, ""), [selectedKeys]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Check if user is logged in
				const isAuthenticated = await checkAuth(apiUrl);
				if (!isAuthenticated) {
					addToast({
						title: "You need to be logged in to access this page.",
						color: "warning"
					});
					router.push("/");
					return;
				}

				// Fetch applicaions (if user is logged in)
				const response = await fetch(`${apiUrl}/get-emails`, {
					method: "GET",
					credentials: "include" // Include cookies for session management
				});

				if (!response.ok) {
					if (response.status === 404) {
						setError("No applications found");
					} else {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
				}
				console.log("Got emails!");

				const result = await response.json();

				setData(result);
			} catch {
				setError("Failed to load applications");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [apiUrl, router]);

	useEffect(() => {
		async function fetchSessionData() {
			try {
				const response = await fetch("http://localhost:8000/api/session-data", {
					method: "GET",
					credentials: "include"
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				console.log("Session data after fetch session:", data);
				setSessionData(data);
				console.log("Session data b4 is_new_user:", data);
				setIsNewUser(!!data.is_new_user); // Set the new user flag
				setShowModal(!!data.is_new_user); // Show modal if new user
			} catch (error) {
				console.error("Error fetching session data:", error);
				setError("Failed to load session data");
			}
		}
		fetchSessionData();
	}, []);

	useEffect(() => {
		console.log("isNewUser:", isNewUser);
		setShowModal(isNewUser);
	}, [isNewUser]);

	// Sort data based on selected key
	useEffect(() => {
		const sortData = () => {
			const sorted = [...data];
			const sortKey = Array.from(selectedKeys)[0];

			switch (sortKey) {
				case "Date (Newest)":
					sorted.sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime());
					break;
				case "Date (Oldest)":
					sorted.sort((a, b) => new Date(a.received_at).getTime() - new Date(b.received_at).getTime());
					break;
				case "Company":
					sorted.sort((a, b) => a.company_name.localeCompare(b.company_name));
					break;
				case "Job Title":
					sorted.sort((a, b) => a.job_title.localeCompare(b.job_title));
					break;
				case "Status":
					sorted.sort((a, b) => a.application_status.localeCompare(b.application_status));
					break;
				default:
					break;
			}
			setSortedData(sorted);
		};

		if (data.length > 0) {
			sortData();
		}
	}, [selectedKeys, data]);

	const handleSave = async () => {
		if (!selectedDate) return alert("Please select a start date");

		setIsSaving(true);
		try {
			const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;
			// Step 1: Save the start date
			const response = await fetch(`${apiUrl}/set-start-date`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({ start_date: formattedDate.toString() }),
				credentials: "include"
			});

			if (!response.ok) throw new Error("Failed to save start date");

			// Step 2: Start background task (fetch emails)
			startFetchEmailsBackgroundTask();

			// Step 3: Navigate to processing page
			setIsNewUser(false); // Hide the modal after saving
			setShowModal(false);
			router.push("/processing"); // Navigate to the processing page
		} catch (error) {
			alert("Error saving start date. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const startFetchEmailsBackgroundTask = async () => {
		try {
			// Example background task: Start fetching emails
			console.log("Starting background task to fetch emails...");
			const response = await fetch(`${apiUrl}/fetch-emails`, {
				method: "POST", // or GET, depending on your API
				credentials: "include"
			});

			if (!response.ok) {
				console.error("Failed to fetch emails:", await response.text());
				return;
			}

			console.log("Email fetching started successfully!");
		} catch (error) {
			console.error("Error starting background task:", error);
		}
	};

	// Handle sorting selection change and store it in localStorage
	const handleSortChange = (keys: Set<string>) => {
		const sortKey = Array.from(keys)[0];
		localStorage.setItem("sortKey", sortKey);
		setSelectedKeys(new Set([sortKey]));
	};

	async function downloadCsv() {
		setDownloading(true);
		try {
			const response = await fetch(`${apiUrl}/process-csv`, {
				method: "GET",
				credentials: "include"
			});

			if (!response.ok) {
				let description = "Something went wrong. Please try again.";

				if (response.status === 429) {
					description = "Download limit reached. Please wait before trying again.";
				} else {
					description = "Please try again or contact help@jobba.help if the issue persists.";
				}

				addToast({
					title: "Failed to download CSV",
					description,
					color: "danger"
				});

				return;
			}

			// Create a download link to trigger the file download
			const blob = await response.blob();
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.href = url;
			link.download = `job_applications_${new Date().toISOString().split("T")[0]}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch {
			addToast({
				title: "Something went wrong",
				description: "Please try again",
				color: "danger"
			});
		} finally {
			setDownloading(false);
		}
	}

	if (error) {
		return (
			<div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
				<p className="text-red-600 mb-4">{error}</p>
				<button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.reload()}>
					Retry
				</button>
			</div>
		);
	}

	async function downloadSankey() {
		setDownloading(true);
		try {
			const response = await fetch(`${apiUrl}/process-sankey`, {
				method: "GET",
				credentials: "include"
			});

			if (!response.ok) {
				let description = "Something went wrong. Please try again.";

				if (response.status === 429) {
					description = "Download limit reached. Please wait before trying again.";
				} else {
					description = "Please try again or contact help@jobba.help if the issue persists.";
				}

				addToast({
					title: "Failed to download Sankey Diagram",
					description,
					color: "danger"
				});

				return;
			}

			// Create a download link to trigger the file download
			const blob = await response.blob();
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.href = url;
			link.download = `sankey_diagram_${new Date().toISOString().split("T")[0]}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch {
			addToast({
				title: "Something went wrong",
				description: "Please try again",
				color: "danger"
			});
		} finally {
			setDownloading(false);
		}
	}

	return (
		<JobApplicationsDashboard
			data={data}
			downloading={downloading}
			loading={loading}
			onDownloadCsv={downloadCsv}
			onDownloadSankey={downloadSankey}
		/>
	);
}

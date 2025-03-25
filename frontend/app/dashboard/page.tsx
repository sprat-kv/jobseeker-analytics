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

import { DownloadIcon, SortIcon } from "@/components/icons";
import { checkAuth } from "@/utils/auth";

interface Application {
	id?: string;
	company_name: string;
	application_status: string;
	received_at: string;
	job_title: string;
	subject: string;
	email_from: string;
}

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

				if (result.length === 0) {
					setError("No applications found");
				} else {
					setData(result);
				}
			} catch {
				setError("Failed to load applications");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [router]);

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
			const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
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
		<div className="flex flex-col items-center justify-center text-center pt-64">
			{/* Modal for New User */}
			<Modal isOpen={showModal} onOpenChange={setShowModal}>
				<ModalContent>
					<ModalHeader>Select Your Job Search Start Date</ModalHeader>
					<ModalBody>
						<DatePicker value={selectedDate} onChange={setSelectedDate} />
					</ModalBody>
					<ModalFooter>
						<Button color="primary" isLoading={isSaving} onPress={handleSave}>
							Save and Continue
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold">Job Applications Dashboard</h1>
				<div className="flex gap-x-4">
					<Dropdown>
						<DropdownTrigger>
							<Button
								className="pl-3"
								color="primary"
								isDisabled={!data || data.length === 0}
								startContent={<SortIcon />}
								variant="bordered"
							>
								{selectedValue}
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							disallowEmptySelection
							aria-label="Single selection example"
							selectedKeys={selectedKeys}
							selectionMode="single"
							variant="flat"
							onSelectionChange={(keys) => handleSortChange(keys as Set<string>)}
						>
							<DropdownSection title="Sort By">
								<DropdownItem key="Date (Newest)">Date Received (Newest First)</DropdownItem>
								<DropdownItem key="Date (Oldest)">Date Received (Oldest First)</DropdownItem>
								<DropdownItem key="Company">Company (A-Z)</DropdownItem>
								<DropdownItem key="Job Title">Job Title (A-Z)</DropdownItem>
								<DropdownItem key="Status">Application Status</DropdownItem>
							</DropdownSection>
						</DropdownMenu>
					</Dropdown>
					<Button
						color="primary"
						isDisabled={!data || data.length === 0}
						isLoading={downloading}
						startContent={<DownloadIcon />}
						onPress={downloadSankey}
					>
						Download Sankey Diagram
					</Button>
					<Button
						color="success"
						isDisabled={!data || data.length === 0}
						isLoading={downloading}
						startContent={<DownloadIcon />}
						onPress={downloadCsv}
					>
						Download CSV
					</Button>
				</div>
			</div>

			{loading ? (
				<p>Loading applications...</p>
			) : error ? (
				<div className="text-red-500">
					<p>{error}</p>
					<Button color="warning" onPress={() => window.location.reload()}>
						Try again
					</Button>
				</div>
			) : (
				<div className="overflow-x-auto bg-white shadow-md rounded-lg">
					<Table aria-label="Applications Table">
						<TableHeader>
							<TableColumn>Company</TableColumn>
							<TableColumn>Status</TableColumn>
							<TableColumn>Received</TableColumn>
							<TableColumn>Job Title</TableColumn>
							<TableColumn>Subject</TableColumn>
							<TableColumn>Sender</TableColumn>
						</TableHeader>
						<TableBody>
							{sortedData.map((item) => (
								<TableRow key={item.id || item.received_at}>
									<TableCell>{item.company_name || "--"}</TableCell>
									<TableCell>
										<span
											className={`inline-flex items-center justify-center px-2 py-1 rounded ${
												item.application_status.toLowerCase() === "rejected"
													? "bg-red-100 text-red-800"
													: "bg-green-100 text-green-800"
											}`}
										>
											{item.application_status || "--"}
										</span>
									</TableCell>
									<TableCell>{new Date(item.received_at).toLocaleDateString() || "--"}</TableCell>
									<TableCell>{item.job_title || "--"}</TableCell>
									<TableCell className="max-w-[300px] truncate">{item.subject || "--"}</TableCell>
									<TableCell>{item.email_from || "--"}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}

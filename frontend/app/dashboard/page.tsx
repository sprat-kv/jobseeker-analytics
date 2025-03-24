"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

import JobApplicationsDashboard, { Application } from "@/components/JobApplicationsDashboard";
import { checkAuth } from "@/utils/auth";

export default function Dashboard() {
	const router = useRouter();
	const [data, setData] = useState<Application[]>([]);
	const [loading, setLoading] = useState(true);
	const [downloading, setDownloading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
	}, [apiUrl, router]);

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
		<div className="p-6">
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
		);
	}

	return (
		<JobApplicationsDashboard data={data} downloading={downloading} loading={loading} onDownloadCsv={downloadCsv} />
	);
}

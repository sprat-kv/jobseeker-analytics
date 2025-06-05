"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

import { MessageSquareIcon } from "@/components/icons";
import FeedbackSidebar from "@/components/FeedbackSidebar";

export default function FeedbackButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				isIconOnly
				aria-label="Feedback"
				className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
				onClick={() => setIsOpen(!isOpen)}
			>
				<MessageSquareIcon size={24} />
			</Button>
			{isOpen && (
				<div className="fixed bottom-20 right-4 z-50">
					<FeedbackSidebar className="w-80 shadow-xl" />
				</div>
			)}
		</>
	);
}

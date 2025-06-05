"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import Image from 'next/image';

import FeedbackSidebar from "@/components/FeedbackSidebar";

export default function FeedbackButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				isIconOnly
				aria-label="Feedback"
				className="fixed bottom-4 right-4 z-50"
				onPress={() => setIsOpen(!isOpen)}
			>
				<Image src="/feedback-icon.png" alt="Feedback" width={100} height={100} />
			</Button>
			{isOpen && (
				<div className="fixed bottom-20 right-4 z-50">
					<FeedbackSidebar className="w-80 shadow-xl" />
				</div>
			)}
		</>
	);
}

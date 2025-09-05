"use client";

import { useState } from "react";
import { Button, Card, Tabs, Tab } from "@heroui/react";

import { UsersIcon, LineChartIcon, CheckCircle2Icon, PlayIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import DeveloperInfo from "@/components/DeveloperInfo";
import HeroSection from "@/components/HeroSection";

const Index = () => {
	const [tab, setTab] = useState("waitlist");

	const handleWatchDemo = () => {
		window.open("https://www.youtube.com/shorts/YT7qzTh2Q7A", "_blank");
	};

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-grow bg-gradient-to-b from-background to-background/95">
				<Navbar />
				<div className="container mx-auto px-4 py-6">
					<HeroSection onTabChange={setTab} />
					<section className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold text-center mb-10">The Real Problem with the Job Search</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<Card>
								<div className="p-6">
									<LineChartIcon className="text-amber-500 mb-4" size={48} />
									<h3 className="text-xl font-semibold mb-2">Applications Tripled, <br></br>90% Lead to Rejections</h3>
									<p className="text-default-500">
										Through analyzing 31M+ applications, AshbyHQ found applications per hire tripled from 2021-2024. Cold applications have less than 10% response rate.
									</p>
								</div>
							</Card>

							<Card>
								<div className="p-6">
									<CheckCircle2Icon className="text-amber-500 mb-4" size={48} />
									<h3 className="text-xl font-semibold mb-2">Broken Feedback Loop</h3>
									<p className="text-default-500">
									  Existing resume services are a one-time transaction. They get paid to deliver a document, and their job is done- whether it actually gets interviews or not. There's no accountability.
									</p>
								</div>
							</Card>

							<Card>
								<div className="p-6">
									<UsersIcon className="text-amber-500 mb-4" size={48} />
									<h3 className="text-xl font-semibold mb-2">64% of Job Seekers Are Burned Out</h3>
									<p className="text-default-500">
										Auto-apply bots and generic AI resume builders accelerate the cycle of rejection, contributing to candidate burnout and overwhelmed hiring teams.
									</p>
								</div>
							</Card>
						</div>
					</section>


					<section className="max-w-4xl mx-auto pt-32">
						<div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-xl p-8 border border-amber-200">
							<h2 className="text-2xl font-bold text-center mb-6 text-amber-800">Complete the Feedback Loop <br></br> (Without Burning Out)</h2>
							<div className="text-center">
								<p className="text-lg text-gray-700 mb-6 leading-relaxed">
								JAJA's Story Vault, launching Q4 2025, starts with you logging accomplishments via text, voice, email, or with the help of trusted mentors and colleagues who are invited to share testimonials. 
								</p>
								<p className="text-lg text-gray-700 mb-6 leading-relaxed">
								Guided prompts will uncover the metrics and nuanced details that sharpen the human authenticity of your candidate profile. This is your career gold. Spread the riches from your resume to your LinkedIn profile.
								</p>
								<p className="text-lg font-semibold text-emerald-700 mb-6">
								  This is your career gold.
								</p>
								<p className="text-lg text-gray-700 mb-6 leading-relaxed">
								Spread these curated riches from your resume to your LinkedIn profile.
								</p>
								<p className="text-lg font-semibold text-emerald-700 mb-6">
								As you apply, JAJA’s email integration provides real-time analytics, showing which job titles and companies result in interviews.
								</p>
								<p className="text-lg text-gray-700 mb-6 leading-relaxed">
								When a recruiter or hiring manager reaches out by email,<br></br>
								JAJA will automatically synthesize stories from your vault, the submitted resume, and the job description into factually-grounded talking points.
								</p>
								<p className="text-lg font-semibold text-emerald-700 mb-6">
								  You will be as prepared for that high stakes moment as you can be with a confident, relevant narrative.
								</p>
							</div>
						</div>
					</section>

				</div>
			</main>

			<Footer />
		</div>
	);
};

export default Index;

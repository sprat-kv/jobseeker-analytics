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
				<div className="container mx-auto px-4 py-6 space-y-16">
					<HeroSection onTabChange={setTab} />

					<section className="max-w-5xl mx-auto py-8">
						<h2 className="text-3xl font-bold text-center mb-10">The Real Problem with the Job Search</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<Card>
								<div className="p-6">
									<LineChartIcon className="text-purple-500 mb-4" size={48} />
									<h3 className="text-xl font-semibold mb-2">Applications Tripled, <br></br>90% Lead to Rejections</h3>
									<p className="text-default-500">
										Through analyzing 31M+ applications, AshbyHQ found applications per hire tripled from 2021-2024. Cold applications have less than 10% response rate.
									</p>
								</div>
							</Card>

							<Card>
								<div className="p-6">
									<CheckCircle2Icon className="text-purple-500 mb-4" size={48} />
									<h3 className="text-xl font-semibold mb-2">Broken Feedback Loop</h3>
									<p className="text-default-500">
									  Existing resume services are a one-time transaction. They get paid to deliver a document, and their job is done- whether it actually gets interviews or not. There's no accountability.
									</p>
								</div>
							</Card>

							<Card>
								<div className="p-6">
									<UsersIcon className="text-purple-500 mb-4" size={48} />
									<h3 className="text-xl font-semibold mb-2">64% of Job Seekers Are Burned Out</h3>
									<p className="text-default-500">
										Auto-apply bots and generic AI resume builders accelerate the cycle of rejection, contributing to candidate burnout and overwhelmed hiring teams.
									</p>
								</div>
							</Card>
						</div>
					</section>

					<section className="max-w-4xl mx-auto py-8">
						<div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg">
							<div className="text-center space-y-8">
								<div className="space-y-6">
									<p className="text-2xl text-gray-800 font-semibold">
										In 2024, I was laid off by an email.
									</p>
									<p className="text-2xl text-gray-800 font-semibold">
										I started applying and despite tailoring my resume for 100 roles, received nothing but automated rejections.
									</p>
									<p className="text-2xl text-gray-800 font-semibold">
										The lack of feedback was frustrating.
									</p>
								</div>
								
								<div className="border-t border-gray-200 pt-8 space-y-6">
									<p className="text-xl text-gray-700">
										Existing job search tools operate on a broken, transactional model: pay for a resume rewrite or ATS scan, but there's no feedback loop to validate if these actions lead to more interviews.
									</p>
									<p className="text-xl text-gray-700">
										AI auto-apply tools accelerate this cycle of zero feedback, contributing to candidate burnout from high volumes of rejections and overwhelmed hiring teams.
									</p>
									<p className="text-xl font-bold text-purple-700">
										We need a better way to tell our stories.
									</p>
								</div>
								
								<div className="border-t border-purple-200 pt-8">
									<p className="text-xl font-bold text-purple-800">
										JAJA's mission is to shift the focus from beating the bot to marketing undeniably human achievements that leave hiring managers wanting to interview you.
									</p>
								</div>
							</div>
						</div>
					</section>

					{/* Embedded Formbricks Survey */}
					<section id="survey" className="max-w-4xl mx-auto py-8">
						<div style={{ position: "relative", height: "80dvh", overflow: "auto" }}>
							<iframe
								src="https://app.formbricks.com/s/cmagfwkuu3f8bug01e340supq?embed=true"
								frameBorder={0}
								style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", border: 0 }}
							/>
						</div>
					</section>

					<section className="max-w-4xl mx-auto bg-secondary/50 rounded-lg p-8">
						<h2 className="text-2xl font-bold text-center mb-6">The Story Vault Solution</h2>
						<div className="text-center mb-8">
							<p className="text-lg text-default-600 mb-4">
								JAJA starts with the Story Vault (launching Q4 2025), where users log accomplishments via text, voice, email, or with the help of trusted mentors and colleagues who are invited to share work testimonials.
							</p>
							<p className="text-default-500">
								Guided prompts help uncover the specific, nuanced details that sharpen the human authenticity of your resume and LinkedIn. As you apply, JAJA's email integration provides real-time analytics, showing which job titles and industries result in interviews.
							</p>
						</div>
						<Tabs
							aria-label="User Options"
							className="w-full"
							selectedKey={tab}
							onSelectionChange={(key) => setTab(key as string)}
						>
							<Tab key="waitlist" title="Get Early Access">
								<div className="space-y-4 mt-4">
									<p className="text-center text-default-600 mb-6">
										Tell us about your goals to get early access. Take the short survey below.
									</p>
									<div className="flex justify-center">
										<Button
											className="bg-purple-600 hover:bg-purple-700"
											color="primary"
											endContent={<PlayIcon size={16} />}
											onPress={() => {
												const section = document.getElementById("survey");
												section?.scrollIntoView({ behavior: "smooth", block: "start" });
											}}
										>
											Open Survey
										</Button>
									</div>
								</div>
							</Tab>
							<Tab key="developer" title="Do-It-Yourself Install">
								<div className="space-y-4 mt-4">
									<p className="text-center text-default-600 mb-6">
										Not technical? We'll help you get set up! Email us to book time with a friendly
										developer.
									</p>
									<DeveloperInfo />
								</div>
							</Tab>
						</Tabs>
					</section>

					<section className="max-w-4xl mx-auto py-8">
						<div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
							<h2 className="text-2xl font-bold text-center mb-6 text-purple-800">Complete the Feedback Loop</h2>
							<div className="text-center">
								<p className="text-lg text-gray-700 mb-6 leading-relaxed">
									When a conversation is booked, the system instantly synthesizes your story vault, resume, and the job description into factually-grounded talking points, ensuring you're prepared for that opportunity with a confident, relevant narrative.
								</p>
								<p className="text-lg font-semibold text-purple-700">
									Finally, a job search tool that learns from your success and helps you tell your story better with each application.
								</p>
							</div>
						</div>
					</section>

					<section className="max-w-3xl mx-auto bg-secondary/50 rounded-lg p-8 flex flex-col items-center text-center">
						<h2 className="text-2xl font-bold mb-4">Two Steps to Success</h2>
						<div className="space-y-6 mb-8">
							<div className="text-left">
								<h3 className="text-lg font-semibold mb-2">Step 1: Convince yourself</h3>
								<p className="text-default-600">
									Find the undeniable evidence of your own value and build a case for yourself that is so compelling, it silences your own inner critic.
								</p>
							</div>
							<div className="text-left">
								<h3 className="text-lg font-semibold mb-2">Step 2: Convince everyone else</h3>
								<p className="text-default-600">
									Only when you truly believe you are the perfect hire can you ever hope to convince anyone else.
								</p>
							</div>
						</div>
						<Button
							className="bg-purple-600 hover:bg-purple-700"
							color="primary"
							startContent={<PlayIcon size={16} />}
							variant="solid"
							onPress={handleWatchDemo}
						>
							Watch Demo
						</Button>
					</section>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default Index;

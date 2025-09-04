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
						<h2 className="text-3xl font-bold text-center mb-10">The Real Problem with Job Search</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<Card>
								<div className="p-6">
									<LineChartIcon className="text-purple-500 mb-4" size={48} />
									<h3 className="text-xl font-semibold mb-2">It's Not a Numbers Game</h3>
									<p className="text-default-500">
										Applications per role tripled from 2021-2024. Only 4.7% of technical candidates get interviews.
									</p>
								</div>
							</Card>

							<Card>
								<div className="p-6">
									<CheckCircle2Icon className="text-purple-500 mb-4" size={48} />
									<h3 className="text-xl font-semibold mb-2">Companies Don't Prepare You for What's Next</h3>
									<p className="text-default-500">
										Layoffs happen, but no one taught you to write impact metrics. Money is a buffer, but you need the skills to tell your story.
									</p>
								</div>
							</Card>

							<Card>
								<div className="p-6">
									<UsersIcon className="text-purple-500 mb-4" size={48} />
									<h3 className="text-xl font-semibold mb-2">Authentic Human Signal</h3>
									<p className="text-default-500">
										Recruiters need qualified applicants, not generic resumes. Your story is your competitive advantage.
									</p>
								</div>
							</Card>
						</div>
					</section>

					<section className="max-w-4xl mx-auto py-8">
						<div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
							<h2 className="text-2xl font-bold text-center mb-6 text-purple-800">The Numbers Don't Lie</h2>
							<div className="text-center">
								<p className="text-lg text-gray-700 mb-6 leading-relaxed">
									In job applications, quantified achievements make a measurable difference: adding metrics to your resume boosts hireability by about 40%. Professionals whose resumes include concrete numbers (like impact, efficiency, or growth) are 3.2 times more likely to receive interview callbacks.
								</p>
								<p className="text-lg font-semibold text-purple-700">
									Yet, only 26% of resumes feature five or more quantifiable metrics—leaving a vast majority of applicants relying on vague claims that fail to resonate with hiring managers.
								</p>
							</div>
						</div>
					</section>

					<section className="max-w-4xl mx-auto bg-secondary/50 rounded-lg p-8">
						<h2 className="text-2xl font-bold text-center mb-6">The AI-Powered Story Engine</h2>
						<div className="text-center mb-8">
							<p className="text-lg text-default-600 mb-4">
								This is not another resume writer promising to help you beat the ATS.
							</p>
							<p className="text-default-500">
								It's a storytelling tool that helps you turn fragmented, unmemorable bullets into achievements bursting with context.
							</p>
						</div>
						<Tabs
							aria-label="User Options"
							className="w-full"
							selectedKey={tab}
							onSelectionChange={(key) => setTab(key as string)}
						>
							<Tab key="waitlist" title="Join JAJA(Pro) Beta">
								<div className="space-y-4 mt-4">
									<p className="text-center text-default-600 mb-6">
										Reserve your spot in our closed beta. Limited to 100 users.
									</p>
									<WaitlistForm />
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

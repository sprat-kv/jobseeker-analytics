"use client";

import { useState } from "react";
import { Card, Button } from "@heroui/react";

import { UsersIcon, LineChartIcon, CheckCircle2Icon, HeartFilledIcon, MessageSquareIcon, CodeIcon, EyeIcon, PaperAirplaneIcon, SparklesIcon, TrophyIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

const Index = () => {
	const [tab, setTab] = useState("waitlist");

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-grow bg-gradient-to-b from-background to-background/95">
				<Navbar />
				<div className="container mx-auto px-4 py-6">
					<div className="text-center">
						<img alt="Shining Nuggets Logo" className="h-64 w-64 object-contain mx-auto mb-4" src="/logo.png" />
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
							Win the 6-Second Resume Scan.
						</h1>
						<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
							You have 6 seconds to impress a recruiter. Let's make them count.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Button
								as="a"
								href="#waitlist"
								size="lg"
								variant="solid"
								className="bg-amber-600 text-white hover:bg-amber-700"
							>
								Join the Waitlist
							</Button>
						</div>
					</div>
				</div>
			</main>

			<div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:text-center">
						<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600 pb-2">
							The job hunt is a broken feedback loop. Close the loop in "Shining Nuggets"
						</p>
						<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
							After being laid off from a gaming company in early 2024, I built Just A Job App (JAJA) to regain my confidence as a developer. 
						</p>
						<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
							Our open-source, AI-powered job application tracker is now expanding to include a mobile game that makes resume reviews fun. It's a game where you're a gold miner cat digging up your best career achievements.
						</p>
					</div>
					<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
						<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
							<div className="relative pl-16">
								<dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
									<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
										<TrophyIcon aria-hidden="true" className="h-6 w-6 text-white" />
									</div>
									Shining Nuggets
								</dt>
								<dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
									In quick 6-second challenges, get your accomplishments peer-reviewed by other players, earning upgrades as you improve.
								</dd>
							</div>
							<div className="relative pl-16">
								<dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
									<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
										<EyeIcon aria-hidden="true" className="h-6 w-6 text-white" />
									</div>
									Get an Inside Edge
								</dt>
								<dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
									Need an inside edge? Get your achievements reviewed anonymously by players currently working at your target companies.
								</dd>
							</div>
							<div className="relative pl-16">
								<dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
									<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
										<PaperAirplaneIcon aria-hidden="true" className="h-6 w-6 text-white" />
									</div>
									Close the Feedback Loop
								</dt>
								<dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
									Your best, peer-validated achievements sync to our job tracker. It connects to your email to detect interviews near-instantly, proving what gets results.
								</dd>
							</div>
							<div className="relative pl-16">
								<dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
									<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600">
										<SparklesIcon aria-hidden="true" className="h-6 w-6 text-white" />
									</div>
									Prove Your Value
								</dt>
								<dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
									Finally, a way to know which parts of your resume are working, so you can double down on what makes you stand out.
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>

			<section id="waitlist" className="max-w-4xl mx-auto py-16">
				<div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-xl p-8 border border-amber-200 text-center">
					<h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
						Ready to Win the Scan?
					</h2>
					<p className="text-lg text-gray-700 mb-8 leading-relaxed">
						Join the waitlist to get early access to Shining Nuggets and start turning 6 seconds into job offers.
					</p>

					<div className="flex justify-center mb-8">
						{/* Embedded Formbricks Survey */}
						<div style={{ position: "relative", overflow: "auto" }}>
							<iframe
								src="https://app.formbricks.com/s/cmf667qha4ahcyg01nu13lsgo?embed=true"
								style={{ width: "400px", height: "270px", border: 0 }}
							/>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Index;

"use client";

import { useState } from "react";
import { Card, Button } from "@heroui/react";

import { UsersIcon, LineChartIcon, CheckCircle2Icon, HeartFilledIcon, MessageSquareIcon, CodeIcon, EyeIcon, PaperAirplaneIcon, SparklesIcon, TrophyIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

const Index = () => {
	const [tab, setTab] = useState("waitlist");
	const [showImagePopup, setShowImagePopup] = useState(false);

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-grow bg-gradient-to-b from-background to-background/95">
				<Navbar />
				<div className="container mx-auto px-4 py-6">
					<div className="text-center">
						<img alt="Shining Nuggets Logo" className="h-64 w-64 object-contain mx-auto mb-4" src="/logo.png" />
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
							9 out of 10 applications are met with rejection or silence. <br /> We're building the platform to make yours the one they can't ignore.
						</h1>
						<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
							We're creating a new tool for ambitious professionals, combining a smart application tracker with a game that gets you real feedback. Our private beta is currently full, but you can request early access to our next release.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Button
								as="a"
								href="#waitlist"
								size="lg"
								variant="solid"
								className="bg-amber-600 text-white hover:bg-amber-700"
							>
								Request Early Access
							</Button>
						</div>
						<p className="mt-4 text-sm text-gray-500">Sign up to be first in line when we open more spots.</p>
					</div>
				</div>
			</main>

			{/* Social Proof Bar */}
			<div className="bg-white dark:bg-gray-900 py-12">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
						<div className="flex flex-col items-center">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
							</svg>
							<h3 className="text-lg font-semibold">Featured on GitHub</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">As seen on their official YouTube channel with over 500,000 subscribers.</p>
						</div>
						<div className="flex flex-col items-center">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-amber-500" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
							</svg>
							<h3 className="text-lg font-semibold">Trusted by Developers</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">A 42% increase in GitHub stars after our feature, validating our approach.</p>
						</div>
						<div className="flex flex-col items-center">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
								<circle cx="9" cy="7" r="4"></circle>
								<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
								<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
							</svg>
							<h3 className="text-lg font-semibold">Join The Waitlist</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">300+ professionals have already signed up organically to get early access.</p>
						</div>
					</div>
				</div>
			</div>

			{/* Problem/Agitation Section */}
			<div className="container mx-auto px-4 py-24 sm:py-32">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
					<div>
						{/* Chart image with click functionality */}
						<div 
							className="bg-gray-200 dark:bg-gray-700 h-80 w-full rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
							onClick={() => setShowImagePopup(true)}
						>
							<div className="relative">
								<img 
									alt="Chart showing Applications Per Hire tripling" 
									src="homepage/Problem.png" 
									className="max-h-80 max-w-full object-contain"
								/>
								<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
									</svg>
								</div>
							</div>
						</div>
					</div>
					<div>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The Job Search is Officially Broken. It's Not Just You.</h2>
						<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
							Does this sound familiar? You spend hours tailoring your resume and writing the perfect cover letter, only to send it into a black hole. Days turn into weeks. The only reply is a generic rejection email, or worse, complete silence.
						</p>
						<p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">You're not imagining it. The game has changed:</p>
						<ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-300">
							<li>
								<strong className="font-semibold text-gray-900 dark:text-white">It's 3x more competitive:</strong> The number of applications per hire has tripled since early 2021. (Source: AshbyHQ)
							</li>
							<li>
								<strong className="font-semibold text-gray-900 dark:text-white">It's overwhelming:</strong> Our research shows 77% of job seekers use over three different tools to manage a process 64% already find frustrating.
							</li>
							<li>
								<strong className="font-semibold text-gray-900 dark:text-white">It's leading to burnout:</strong> 64% of applicants report feeling exhausted and stuck. (Source: Huntr)
							</li>
						</ul>
						<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
							You're left wondering, "Is my experience not good enough?" when the real problem is you're playing a game with no rules and no scoreboard.
						</p>
					</div>
				</div>
			</div>

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
			<div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:text-center">
						<h2 className="text-3xl font-bold text-center mb-12">What We're Building For You</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
							<div>
								<h3 className="text-xl font-semibold mb-2">AI-Powered Job Application Tracker</h3>
								<p className="text-default-500">Centralize every application, note, and contact to finally end the chaos of spreadsheets. <br/><strong className="text-amber-600">Benefit: Feel in command of your search, not overwhelmed by it.</strong></p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Anonymous Peer Reviews in 'Shining Nuggets'</h3>
								<p className="text-default-500">Get honest feedback on your achievements from professionals in your field without ever revealing your identity. <br/><strong className="text-amber-600">Benefit: Gain insider knowledge without jeopardizing your current job.</strong></p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Gamified Resume Building</h3>
								<p className="text-default-500">We're making resume prep an addictive habit you can do on your coffee break. <br/><strong className="text-amber-600">Benefit: Stay motivated and consistently prepared for new opportunities.</strong></p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">The Interview Feedback Loop</h3>
								<p className="text-default-500">For the first time, you'll be able to connect your resume content directly to interview invites. <br/><strong className="text-amber-600">Benefit: Stop guessing and use data-backed strategies to get hired faster.</strong></p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:text-center">
						<div>
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your Future Path to a Better Job Offer</h2>
							<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
								<div className="flex flex-col items-center">
									<div className="bg-amber-100 text-amber-800 text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">1</div>
									<h3 className="text-xl font-semibold mb-2">You'll Get Organized Instantly.</h3>
									<p className="text-gray-600 dark:text-gray-300">You'll use the tracker to see your entire job search pipeline in one clean dashboard, with AI-powered features that automate the tedious parts.</p>
								</div>
								<div className="flex flex-col items-center">
									<div className="bg-amber-100 text-amber-800 text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">2</div>
									<h3 className="text-xl font-semibold mb-2">You'll Play 'Shining Nuggets'.</h3>
									<p className="text-gray-600 dark:text-gray-300">You'll mine your professional achievements and get them anonymously peer-reviewed in fun, 6-second challenges.</p>
								</div>
								<div className="flex flex-col items-center">
									<div className="bg-amber-100 text-amber-800 text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">3</div>
									<h3 className="text-xl font-semibold mb-2">You'll Apply with Data-Backed Confidence.</h3>
									<p className="text-gray-600 dark:text-gray-300">You'll use your top-rated, validated achievements to build resumes that get noticed, closing the frustrating gap between application and interview.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:text-center">
						<h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
							The Future of the Job Search is Being Built. Join Us.
						</h2>
						<p className="text-lg text-gray-700 mb-8 leading-relaxed">
							Stop throwing resumes into the void. We're creating a platform that gives you control, confidence, and the feedback you've always needed. Our beta is currently full, but the next release is coming soon. Request your invite to be first in line and help us build a better way to get hired.
						</p>
						<Button as="a" href="#waitlist" size="lg" className="bg-amber-600 text-white hover:bg-amber-700">
							Request Early Access
						</Button>
					</div>
				</div>
			</div>
			<Footer />

			{/* Image Popup Overlay */}
			{showImagePopup && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
					onClick={() => setShowImagePopup(false)}
				>
					<div 
						className="relative w-full max-w-6xl"
					>
						<button 
							className="absolute -top-12 right-0 text-white hover:text-amber-500 focus:outline-none"
							onClick={(e) => {
								e.stopPropagation();
								setShowImagePopup(false);
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl overflow-hidden">
							<img 
								src="homepage/Problem2.png" 
								alt="Chart showing Applications Per Hire tripling" 
								className="w-full h-auto"
								style={{ maxHeight: "90vh" }}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Index;

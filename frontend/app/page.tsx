"use client";

import { useState } from "react";
import { Card } from "@heroui/react";

import { UsersIcon, LineChartIcon, CheckCircle2Icon, HeartFilledIcon, MessageSquareIcon, CodeIcon } from "@/components/icons";
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
					<HeroSection onTabChange={setTab} />
					
					{/* Problem Section */}
					<section className="max-w-4xl mx-auto py-16">
						<div className="text-center mb-12">
							<h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
								The Hardest Part of the Job Search is Believing in Yourself.
							</h2>
							<div className="text-lg text-default-600 leading-relaxed space-y-4">
								<p>
									Each automated rejection feels personal. Every unreturned email fuels the inner critic that asks, "Am I good enough?" The lack of feedback isn't just frustrating; it creates a cycle of self-doubt that makes it impossible to present your best self.
								</p>
								<p className="text-xl font-semibold text-amber-600">
									Because if you don't believe in your own story, hiring managers won't either.
								</p>
							</div>
						</div>
					</section>

					{/* Solution Section */}
					<section className="max-w-4xl mx-auto py-16">
						<div className="text-center mb-12">
							<h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
								A System to Provide Proof of Your Value.
							</h2>
							<p className="text-lg text-default-600 mb-12">
								JAJA is designed to rebuild your professional confidence with undeniable evidence.
							</p>
						</div>
						
						<div className="grid md:grid-cols-3 gap-8">
							<Card className="p-6">
								<div className="text-center">
									<div className="bg-amber-100 text-amber-800 text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">1</div>
									<h3 className="text-xl font-semibold mb-4">Reclaim Your Narrative</h3>
									<p className="text-default-500">
										The Story Vault is your evidence locker. Actively logging your quantified achievements and collecting testimonials from colleagues provides a tangible record of your impact, silencing imposter syndrome with facts.
									</p>
								</div>
							</Card>

							<Card className="p-6">
								<div className="text-center">
									<div className="bg-amber-100 text-amber-800 text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">2</div>
									<h3 className="text-xl font-semibold mb-4">See Your Value on Paper</h3>
									<p className="text-default-500">
										Our AI translates your achievements into a powerful resume. It takes the self-doubt out of writing about yourself and generates a document that reflects your true professional worth.
									</p>
								</div>
							</Card>

							<Card className="p-6">
								<div className="text-center">
									<div className="bg-amber-100 text-amber-800 text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">3</div>
									<h3 className="text-xl font-semibold mb-4">Get Objective Proof from the Market</h3>
									<p className="text-default-500">
										Our analytics engine connects your applications to interviews, providing external validation that you are in demand. Every interview call is a data point that proves you belong.
									</p>
								</div>
							</Card>
						</div>
					</section>

					{/* Features as Benefits Section */}
					<section className="max-w-5xl mx-auto py-16">
						<h2 className="text-3xl font-bold text-center mb-12">Features as Benefits</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<Card className="p-6">
								<div className="text-center">
									<HeartFilledIcon className="text-amber-500 mb-4 mx-auto" size={48} />
									<h3 className="text-xl font-semibold mb-4">Your Personal Evidence Locker</h3>
									<p className="text-default-500">
										Combat the inner critic with facts. The Story Vault provides a dedicated space to document your quantified wins and surround yourself with positive testimonials from people who know your work best, creating a reservoir of proof to draw upon.
									</p>
								</div>
							</Card>

							<Card className="p-6">
								<div className="text-center">
									<LineChartIcon className="text-amber-500 mb-4 mx-auto" size={48} />
									<h3 className="text-xl font-semibold mb-4">Data That Defeats Doubt</h3>
									<p className="text-default-500">
										Feelings aren't facts. JAJA provides objective proof of what's working. See which of your applications are landing interviews and replace the anxiety of the unknown with the confidence that comes from a clear, data-backed strategy.
									</p>
								</div>
							</Card>

							<Card className="p-6">
								<div className="text-center">
									<CheckCircle2Icon className="text-amber-500 mb-4 mx-auto" size={48} />
									<h3 className="text-xl font-semibold mb-4">Confidence is a Habit, Not a Project</h3>
									<p className="text-default-500">
										After you land your role, JAJA helps you continuously log your wins. This turns confidence into an ongoing practice, ensuring you never have to start from zero again.
									</p>
								</div>
							</Card>
						</div>
					</section>

					{/* Final CTA Section */}
					<section className="max-w-4xl mx-auto py-16">
						<div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-xl p-8 border border-amber-200 text-center">
							<h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
								Believe in Yourself. We'll Bring the Proof.
							</h2>
							<p className="text-lg text-gray-700 mb-8 leading-relaxed">
								Get the tools and the evidence you need to walk into your job search with conviction. Enter your email to be the first to know when our confidence-building tools launch in Q4 2025.
							</p>
							
							<div className="flex justify-center mb-8">
								{/* Embedded Formbricks Survey */}
								<div style={{ position: "relative", overflow: "auto" }}>
									<iframe
										src="https://app.formbricks.com/s/cmf667qha4ahcyg01nu13lsgo?embed=true"
										style={{ width: "100%", height: "270px", border: 0 }}
									/>
								</div>
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

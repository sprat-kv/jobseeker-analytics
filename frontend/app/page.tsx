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
								You Are Not a Pile of Dirt.
							</h2>
							<div className="text-lg text-default-600 leading-relaxed space-y-4">
								<p>
									Rejection by rejection, the job search convinces you of a lie: that your experience is worthless. You're told to try countless complex tools, but they all miss the point. The self-doubt becomes so heavy that you start to believe there's no gold to be found.
								</p>
								<p className="text-xl font-semibold text-amber-600">
									You can't market what you don't believe you have.
								</p>
							</div>
						</div>
					</section>

					{/* Solution Section */}
					<section className="max-w-4xl mx-auto py-16">
						<div className="text-center mb-12">
							<h2 className="text-4xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
								Unearthing, Polishing, and Proving Your Worth.
							</h2>
							<p className="text-lg text-default-600 mb-12">
								JAJA provides a systematic process to reveal and validate your intrinsic professional value.
							</p>
						</div>
						
						<div className="grid md:grid-cols-3 gap-8">
							<Card className="p-6">
								<div className="text-center">
									<div className="bg-amber-100 text-amber-800 text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">1</div>
									<h3 className="text-xl font-semibold mb-4">The Unearthing Process</h3>
									<p className="text-default-500">
										The Story Vault is your personal dig site. Guided prompts and testimonials from colleagues are the tools that help you gently sift through your experience, unearthing the flecks of gold—your specific, quantified achievements—that were hidden in plain sight.
									</p>
								</div>
							</Card>

							<Card className="p-6">
								<div className="text-center">
									<div className="bg-amber-100 text-amber-800 text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">2</div>
									<h3 className="text-xl font-semibold mb-4">Polishing Each Find</h3>
									<p className="text-default-500">
										Our AI takes these raw flecks of gold and polishes them into compelling resume bullet points and narratives, making their brilliance and value immediately obvious for each job application.
									</p>
								</div>
							</Card>

							<Card className="p-6">
								<div className="text-center">
									<div className="bg-amber-100 text-amber-800 text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">3</div>
									<h3 className="text-xl font-semibold mb-4">Proving Market Value</h3>
									<p className="text-default-500">
										Our analytics engine is the final proof. It tracks your applications and confirms when the market strikes gold, showing you which of your polished achievements are securing valuable interviews.
									</p>
								</div>
							</Card>
						</div>
					</section>

					{/* Our Philosophy Section */}
					<section className="max-w-4xl mx-auto py-16">
						<div className="text-center mb-12">
							<h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
								More Than 'Just' a Job App.
							</h2>
							<div className="text-lg text-default-600 leading-relaxed space-y-4">
								<p>
									We chose the name JustAJobApp.com for a reason. The job search industry is full of complicated tools that don't solve the core problem: a crisis of confidence.
								</p>
								<p>
									Our platform may look simple, but its purpose is profound. We believe the focus shouldn't be on the application itself, but on the undeniable value of the person applying. Our job is to help you unearth that value. The rest is just an application.
								</p>
							</div>
						</div>
					</section>

					{/* Features as Benefits Section */}
					<section className="max-w-5xl mx-auto py-16">
						<h2 className="text-3xl font-bold text-center mb-12">Features as Benefits</h2>
						<div className="grid md:grid-cols-3 gap-8">
							<Card className="p-6">
								<div className="text-center">
									<HeartFilledIcon className="text-amber-500 mb-4 mx-auto" size={48} />
									<h3 className="text-xl font-semibold mb-4">Your Evidence of Untapped Value</h3>
									<p className="text-default-500">
										Stop seeing yourself as dirt. The JAJA Story Vault is a systematic process for unearthing the undeniable evidence of your accomplishments. It's a living record of your value, proving your worth first and foremost, to you.
									</p>
								</div>
							</Card>

							<Card className="p-6">
								<div className="text-center">
									<LineChartIcon className="text-amber-500 mb-4 mx-auto" size={48} />
									<h3 className="text-xl font-semibold mb-4">Presenting Your Polished Gold</h3>
									<p className="text-default-500">
										When it's time to talk to a hiring manager, JAJA synthesizes your best finds into factually-grounded talking points. You'll be prepared to showcase your most valuable, polished achievements with the confidence of someone who now knows their worth.
									</p>
								</div>
							</Card>

							<Card className="p-6">
								<div className="text-center">
									<CheckCircle2Icon className="text-amber-500 mb-4 mx-auto" size={48} />
									<h3 className="text-xl font-semibold mb-4">A Continuously Richer Vein</h3>
									<p className="text-default-500">
										Your value doesn't stop growing. After you land a role, JAJA helps you continue to unearth and log new achievements, ensuring your personal gold mine becomes richer and more valuable over time.
									</p>
								</div>
							</Card>
						</div>
					</section>

					{/* Final CTA Section */}
					<section className="max-w-4xl mx-auto py-16">
						<div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-xl p-8 border border-amber-200 text-center">
							<h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
								It's Time to See Your Own Value.
							</h2>
							<p className="text-lg text-gray-700 mb-8 leading-relaxed">
								Stop doubting and start digging with purpose. Enter your email to be the first to know when our career discovery tools launch in Q4 2025.
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
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default Index;

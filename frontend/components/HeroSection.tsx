import { Button } from "@heroui/react";

import { ChevronRightIcon } from "@/components/icons";

interface HeroSectionProps {
	onTabChange: (tab: string) => void;
}

const HeroSection = ({ onTabChange }: HeroSectionProps) => {
	return (
		<section className="py-12 md:py-20 text-center">
			<div className="flex flex-col items-center mb-8">
				<img 
					src="/logo.png" 
					alt="Just a Job App Logo" 
					className="h-24 w-24 md:h-32 md:w-32 object-contain mb-6"
				/>
				<h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">
					Unearthing Your Career Gold
				</h2>
			</div>
			<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 leading-tight max-w-4xl mx-auto">
				There's no ATS hack. No bots to beat. It's just you.
			</h1>

			<p className="text-xl md:text-2xl text-default-500 mb-10 max-w-3xl mx-auto">
				The most powerful tool in your job search isn't an ATS-proof resume. It's a deeply understood and confidently told personal narrative.
			</p>

			<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
				<div className="flex flex-col items-center gap-4">
					<h3 className="text-lg font-semibold text-purple-600">Get Started</h3>
					<Button
						className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 text-lg h-auto"
						color="primary"
						endContent={<ChevronRightIcon size={20} />}
						onPress={() => {
							const section = document.getElementById("survey");
							section?.scrollIntoView({ behavior: "smooth", block: "start" });
						}}
					>
						Sign up in less than a minute
					</Button>
				</div>

				<div className="flex flex-col items-center gap-4">
					<h3 className="text-lg font-semibold text-purple-600">Open Source</h3>
					<Button
						className="px-6 py-6 text-lg h-auto"
						variant="bordered"
						onPress={() => {
							onTabChange("developer");
							setTimeout(() => {
								const section = document.querySelector('[aria-label="User Options"]');
								section?.scrollIntoView({ behavior: "smooth", block: "start" });
							}, 100);
						}}
					>
						Run It Yourself
					</Button>
				</div>
			</div>

		</section>
	);
};

export default HeroSection;

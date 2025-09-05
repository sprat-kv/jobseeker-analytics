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
				<h2 className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
					Unearthing Your Career Gold
				</h2>
			</div>
			<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600 leading-tight max-w-4xl mx-auto py-2">
				It's not a numbers game anymore.
			</h1>

			<p className="text-xl md:text-2xl text-default-500 mb-10 max-w-3xl mx-auto">
				You don't have to be a social media influencer to land an interview. You just need to be human.
			</p>

			<div className="flex justify-center mb-12">
									{/* Embedded Formbricks Survey */}
						<div style={{ position: "relative", overflow: "auto" }}>
							<iframe
								src="https://app.formbricks.com/s/cmf667qha4ahcyg01nu13lsgo?embed=true"
								style={{ width: "100%", height: "270px", border: 0 }}
							/>
						</div>
			</div>

		</section>
	);
};

export default HeroSection;

interface HeroSectionProps {
	onTabChange: (tab: string) => void;
}

const HeroSection = ({ onTabChange }: HeroSectionProps) => {
	return (
		<section className="py-12 md:pt-20 text-center">
			<div className="flex flex-col items-center mb-8">
				<img
					alt="Just a Job App Logo"
					className="h-32 w-32 sm:h-96 sm:w-96 mb-6"
					src="/favicon.ico"
				/>
			</div>
			<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600 leading-tight max-w-4xl mx-auto py-2">
				Stop Doubting. Start Interviewing.
			</h1>

			<p className="text-xl md:text-2xl text-default-500 mb-10 max-w-3xl mx-auto">
				The job search is designed to crush confidence. JAJA provides the undeniable proof of your value—your own achievements, backed by data—so you can market yourself with the conviction you deserve.
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

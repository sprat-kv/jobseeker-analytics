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
					src="/logo.png"
				/>
			</div>
			<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600 leading-tight max-w-4xl mx-auto py-2">
				You See Dirt. We See Gold.
			</h1>

			<p className="text-xl md:text-2xl text-default-500 mb-10 max-w-3xl mx-auto">
				After months of job searching, it's easy to see your experience as worthless. JAJA is a system designed to unearth the one thing that truly matters: the gold in your career experience. We help you prove your value first to you, and then to the world.
			</p>

			<div className="flex justify-center mb-12">
				{/* Embedded Formbricks Survey */}
				<div style={{ position: "relative", overflow: "auto" }}>
					<iframe
						src="https://app.formbricks.com/s/cmf667qha4ahcyg01nu13lsgo?embed=true"
						style={{ width: "400px", height: "270px", border: 0 }}
					/>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;

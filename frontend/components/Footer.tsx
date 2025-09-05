import { EmailIcon, ExternalLinkIcon } from "@/components/icons";

const Footer = () => {
	return (
		<footer className="border-t py-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">About JAJA</h3>
						<p className="text-default-500 mb-4">
							You see dirt. We see gold. JAJA is a system designed to unearth the one thing that truly matters: the gold in your career experience. We help you prove your value first to you, and then to the world.
						</p>
						<a
							className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors font-medium"
							href="https://app.formbricks.com/s/cmf667qha4ahcyg01nu13lsgo"
							rel="noopener noreferrer"
							target="_blank"
						>
							<ExternalLinkIcon size={16} />
							Unearth My Gold
						</a>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">The Solution</h3>
						<ul className="space-y-2 text-default-500">
							<li>
								<a className="text-emerald-700">The Unearthing Process:</a> Your personal dig site for finding gold
							</li>
							<li>
								<a className="text-emerald-700">Polishing Each Find:</a> Transform raw gold into compelling narratives
							</li>
							<li>
								<a className="text-emerald-700">Proving Market Value:</a> Confirm when the market strikes gold
							</li>
							<li>
								<a className="text-emerald-700">Continuous Mining:</a> Keep your gold mine growing richer
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">See Your Own Value</h3>
						<p className="text-default-500 mb-4">
							Stop doubting and start digging with purpose. It's time to see your own value.
						</p>
						<div className="space-y-4">
							<a
								className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors font-medium"
								href="https://app.formbricks.com/s/cmf667qha4ahcyg01nu13lsgo"
								rel="noopener noreferrer"
								target="_blank"
							>
								<ExternalLinkIcon size={16} />
								Join the Waitlist & Prove Your Value
							</a>
							<a
								className="flex items-center gap-2 text-sm text-default-500 hover:text-amber-700 transition-colors"
								href="mailto:hello@justajobapp.com"
							>
								<EmailIcon size={16} />
								hello@justajobapp.com
							</a>
						</div>
					</div>
				</div>

				<div className="mt-12 pt-6 border-t text-center text-sm text-default-500">
					<p className="mt-2 text-amber-600 font-medium">
						© {new Date().getFullYear()} Just A Job App - You See Dirt. We See Gold.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

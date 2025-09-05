import { EmailIcon, ExternalLinkIcon } from "@/components/icons";

const Footer = () => {
	return (
		<footer className="border-t py-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4 text-amber-600">About JAJA</h3>
						<p className="text-default-500 mb-4">
							Unearthing Your Career Gold. Built by jobseekers who understand the struggle of automated rejections and zero feedback.
						</p>
						<p className="text-sm text-default-500 font-medium mb-2">Story Vault launching Q4 2025</p>
						<a
							className="flex items-center gap-2 text-sm text-default-500 hover:text-foreground transition-colors"
							href="https://github.com/your-username/jobseeker-analytics"
							rel="noopener noreferrer"
							target="_blank"
						>
							<ExternalLinkIcon size={16} />
							Open source on GitHub
						</a>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">The Solution</h3>
						<ul className="space-y-2 text-default-500">
							<li>Story Vault: Log achievements via text, voice, email</li>
							<li>Mentor Integration: Trusted colleagues share testimonials</li>
							<li>Real-time Analytics: Track which applications lead to interviews</li>
							<li>Interview Prep: AI-synthesized talking points from your vault</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-amber-600">Get Early Access</h3>
						<div className="space-y-4">

							<a
								className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors font-medium"
								href="https://app.formbricks.com/s/cmf667qha4ahcyg01nu13lsgo"
								rel="noopener noreferrer"
								target="_blank"
							>
								<ExternalLinkIcon size={16} />
								Join the waitlist
							</a>
							<a
								className="flex items-center gap-2 text-sm text-default-500 hover:text-amber-700 transition-colors font-medium"
								href="mailto:hello@justajobapp.com"
							>
								<EmailIcon size={16} />
								hello@justajobapp.com
							</a>
							<a
								className="flex items-center gap-2 text-sm text-default-500 hover:text-foreground transition-colors"
								href="https://discord.gg/gsdpMchCam"
								rel="noopener noreferrer"
								target="_blank"
							>
								<ExternalLinkIcon size={16} />
								Join our Discord
							</a>
						</div>
					</div>
				</div>

				<div className="mt-12 pt-6 border-t text-center text-sm text-default-500">
					<p className="mt-2 text-amber-600 font-medium">© {new Date().getFullYear()} Just a Job App - Unearthing Your Career Gold</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

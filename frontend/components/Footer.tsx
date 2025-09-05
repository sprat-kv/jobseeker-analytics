import { EmailIcon, ExternalLinkIcon } from "@/components/icons";

const Footer = () => {
	return (
		<footer className="border-t py-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">About JAJA</h3>
						<p className="text-default-500 mb-4">
							Built by jobseekers who understand the struggle of automated rejections and zero feedback.
						</p>
						<a
							className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors font-medium"
							href="https://app.formbricks.com/s/cmf667qha4ahcyg01nu13lsgo"
							rel="noopener noreferrer"
							target="_blank"
						>
							<ExternalLinkIcon size={16} />
							Join the waitlist
						</a>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">The Solution</h3>
						<ul className="space-y-2 text-default-500">
							<li>
								<a className="text-emerald-700">Story Vault:</a> Log achievements via text, voice, email
							</li>
							<li>
								<a className="text-emerald-700">Mentor Integration:</a> Trusted colleagues share
								testimonials
							</li>
							<li>
								<a className="text-emerald-700">Real-time Analytics:</a> Track which applications lead
								to interviews
							</li>
							<li>
								<a className="text-emerald-700">Interview Prep:</a> Talking points from your vault,
								tailored to the role
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">Get Early Access</h3>
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
						© {new Date().getFullYear()} Just A Job App - Unearthing Your Career Gold
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

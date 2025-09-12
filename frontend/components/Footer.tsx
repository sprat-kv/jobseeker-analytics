"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

import { ExternalLinkIcon, GoogleIcon } from "@/components/icons";

const Footer = () => {
	const router = useRouter();
	const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

	const handleGoogleLogin = () => {
		router.push(`${apiUrl}/login`);
	};

	return (
		<footer className="border-t py-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">Shining Nuggets</h3>
						<p className="text-default-500 mb-4">
							Win the 6-second resume scan. A game to find and prove your value.
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">Ready to Play?</h3>
						<p className="text-default-500 mb-4">
							Join the waitlist to get early access and turn your achievements into job offers.
						</p>
						<a
							className="flex items-center justify-center md:justify-start gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors font-medium"
							href="#waitlist"
						>
							<ExternalLinkIcon size={16} />
							Join the Waitlist
						</a>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-4 text-emerald-700">Already a Beta Tester?</h3>
						<p className="text-default-500 mb-4">
							The job tracker is still here! We're building Resume Gold Rush to help you find your best achievements.
						</p>
						<Button
							onClick={handleGoogleLogin}
							variant="bordered"
							className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
							startContent={<GoogleIcon size={16} />}
						>
							Login with Google
						</Button>
					</div>
				</div>

				<div className="mt-12 pt-6 border-t text-center text-sm text-default-500">
					<p className="mt-2 text-amber-600 font-medium">© {new Date().getFullYear()} Shining Nuggets</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

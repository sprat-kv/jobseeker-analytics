"use client";
import Head from "next/head";

export default function Home() {
	return (
		<>
			<Head>
				<title>jobba.help</title>
				<meta content="width=device-width, initial-scale=1.0" name="viewport" />
				<link href="/favicon-96x96.png" rel="icon" sizes="96x96" type="image/png" />
				<link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
				<meta content="jobba.help" name="apple-mobile-web-app-title" />
				<link href="/static/site.webmanifest" rel="manifest" />
			</Head>

			<main className="max-w-2xl mx-auto p-6 shadow-md rounded-lg">
				<h2 className="text-2xl font-bold mt-6 mb-4">Resources</h2>

				<div className="space-y-4">
					{/* Discord Resource Card */}
					<a
						className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800 dark:border-gray-700"
						href="https://discord.gg/5tTT6WVQyw"
					>
						<div className="flex items-center">
							<div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
								<svg
									className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.28a18.566 18.566 0 0 0-5.487 0 12.217 12.217 0 0 0-.617-1.28.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .078.009c.12.098.246.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
								</svg>
							</div>
							<div className="ml-4">
								<h3 className="text-lg font-medium text-gray-900 dark:text-white">
									jobba.help Community on Discord
								</h3>
								<p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
									Join our community to share feedback with the developers.
								</p>
							</div>
						</div>
					</a>

					{/* Never Search Alone Resource Card */}
					<a
						className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800 dark:border-gray-700"
						href="https://www.phyl.org/"
					>
						<div className="flex items-center">
							<div className="flex-shrink-0 bg-emerald-100 dark:bg-emerald-900 p-3 rounded-lg">
								<svg
									className="h-6 w-6 text-emerald-600 dark:text-emerald-300"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
							<div className="ml-4">
								<h3 className="text-lg font-medium text-gray-900 dark:text-white">
									Never Search Alone - phyl.org
								</h3>
								<p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
									Join a free peer support group with a thriving online community of job seekers.
								</p>
							</div>
						</div>
					</a>
				</div>
			</main>
		</>
	);
}

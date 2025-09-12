"use client";

import {
	Navbar as HeroUINavbar,
	NavbarContent,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	Button,
	Link,
	Tooltip
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, DiscordIcon, HeartFilledIcon, GoogleIcon, LogOutIcon, InfoIcon } from "@/components/icons";

export const Navbar = () => {
	const pathname = usePathname();
	const router = useRouter();

	const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

	const handleGoogleLogin = () => {
		router.push(`${apiUrl}/login`);
	};

	const handleGoogleLogout = async () => {
		router.push(`${apiUrl}/logout`);
	};

	const loginTooltipContent = (
		<div className="px-1 py-2 max-w-xs">
			<div className="text-sm font-bold mb-1">Heads up</div>
			<div className="text-xs">
				Login is currently limited. Want early access? Please complete the short survey below.
			</div>
		</div>
	);

	return (
		<HeroUINavbar
			isBordered
			className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
			maxWidth="xl"
		>
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<div className="flex items-center gap-3">
							<img alt="Shining Nuggets Logo" className="h-12 w-12 object-contain" src="/logo.png" />
							<div className="flex flex-col">
								<span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-emerald-600">
									Shining Nuggets
								</span>
								<span className="text-xs text-default-500 -mt-1">Win the 6-Second Resume Scan</span>
							</div>
						</div>
					</NextLink>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden md:flex basis-1/5 sm:basis-full" justify="end">
				<NavbarItem>
					<Button as="a" href="#waitlist" variant="solid" className="bg-amber-600 text-white hover:bg-amber-700">
						Join the Waitlist
					</Button>
				</NavbarItem>
			</NavbarContent>

			{/* Smaller screens */}
			<NavbarContent className="md:hidden" justify="end">
				<Button as="a" href="#waitlist" variant="solid" size="sm" className="bg-amber-600 text-white hover:bg-amber-700">
					Join Waitlist
				</Button>
			</NavbarContent>
		</HeroUINavbar>
	);
};

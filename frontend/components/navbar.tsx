"use client";

import { Navbar as HeroUINavbar, NavbarContent, NavbarMenuToggle, NavbarBrand, NavbarItem } from "@heroui/react";
import { Button, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, HeartFilledIcon, GoogleIcon } from "@/components/icons";
import RedirectUrl from "@/utils/navbar-utils";

export const Navbar = () => {
	const router = useRouter();

	const handleGoogleLogin = () => {
		router.push(`${RedirectUrl("PROD")}/login`);
	};

	return (
		<HeroUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<div>
							<p className="text-xl font-bold text-inherit">JOBBA</p>
						</div>
					</NextLink>
				</NavbarBrand>
				<NextLink className="flex justify-start items-center gap-1" href="/dashboard">
					<div>
						<p className="text-l font-bold text-inherit">Dashboard</p>
					</div>
				</NextLink>
				<NextLink className="flex justify-start items-center gap-1" href="/testpage">
					<div>
						<p className="text-l font-bold text-inherit">Test Page</p>
					</div>
				</NextLink>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
				<NavbarItem className="hidden sm:flex gap-2">
					<Link isExternal aria-label="Github" href={siteConfig.links.github}>
						<GithubIcon className="text-default-500" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
				<NavbarItem className="hidden md:flex">
					<Button
						isExternal
						as={Link}
						className="text-sm font-normal text-default-600 bg-default-100"
						href={siteConfig.links.sponsor}
						startContent={<HeartFilledIcon className="text-danger" />}
						variant="flat"
					>
						Sponsor
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<Link isExternal aria-label="Github" href={siteConfig.links.github}>
					<GithubIcon className="text-default-500" />
				</Link>
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarItem className="hidden md:flex">
				<Button
					className="text-sm font-normal text-default-600 bg-default-100"
					startContent={<GoogleIcon className="text-danger" />}
					variant="flat"
					onClick={handleGoogleLogin}
				>
					Login with Google
				</Button>
			</NavbarItem>
		</HeroUINavbar>
	);
};

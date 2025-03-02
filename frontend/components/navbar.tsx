"use client";

import {
	Navbar as HeroUINavbar,
	NavbarContent,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem
} from "@heroui/react";
import { Button, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, HeartFilledIcon, GoogleIcon, LogOutIcon } from "@/components/icons";

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

	return (
		<HeroUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<div>
							<p className="text-md font-bold text-inherit" data-testid="Logo">
								jobba.help
							</p>
						</div>
					</NextLink>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden md:flex basis-1/5 sm:basis-full" justify="end">
				<NavbarItem className="flex gap-2">
					<Link isExternal aria-label="Github" href={siteConfig.links.github}>
						<GithubIcon className="text-default-500" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
				<NavbarItem>
					<Button
						isExternal
						as={Link}
						className="text-sm font-normal text-default-600 bg-default-100"
						data-testid="Sponsor"
						href={siteConfig.links.sponsor}
						startContent={<HeartFilledIcon className="text-danger" />}
						variant="flat"
					>
						Sponsor
					</Button>
				</NavbarItem>
				<NavbarItem>
					{pathname === "/" ? (
						<Button
							className="w-full text-sm font-normal text-default-600 bg-default-100 hover:bg-gray-300"
							data-testid="GoogleLogin"
							startContent={<GoogleIcon className="text-danger" />}
							variant="flat"
							onPress={handleGoogleLogin}
						>
							Login with Google
						</Button>
					) : (
						<Button
							className="w-full text-sm font-normal text-default-600 bg-default-100 hover:bg-gray-300"
							data-testid="GoogleLogout"
							startContent={<LogOutIcon />}
							variant="flat"
							onPress={handleGoogleLogout}
						>
							Logout
						</Button>
					)}
				</NavbarItem>
			</NavbarContent>

			{/* Smaller screens */}
			<NavbarContent className="md:hidden" justify="end">
				<Link isExternal aria-label="Github" href={siteConfig.links.github}>
					<GithubIcon className="text-default-500" />
				</Link>
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				<NavbarMenuItem>
					<Button
						isExternal
						as={Link}
						className="w-full text-sm font-normal text-default-600 bg-default-100"
						href={siteConfig.links.sponsor}
						startContent={<HeartFilledIcon className="text-danger" />}
						variant="flat"
					>
						Sponsor
					</Button>
				</NavbarMenuItem>
				<NavbarMenuItem>
					{pathname === "/" ? (
						<Button
							className="w-full text-sm font-normal text-default-600 bg-default-100 hover:bg-gray-300"
							data-testid="GoogleLogin"
							startContent={<GoogleIcon className="text-danger" />}
							variant="flat"
							onPress={handleGoogleLogin}
						>
							Login with Google
						</Button>
					) : (
						<Button
							className="w-full text-sm font-normal text-default-600 bg-default-100 hover:bg-gray-300"
							data-testid="GoogleLogout"
							startContent={<LogOutIcon />}
							variant="flat"
							onPress={handleGoogleLogout}
						>
							Logout
						</Button>
					)}
				</NavbarMenuItem>
			</NavbarMenu>
		</HeroUINavbar>
	);
};

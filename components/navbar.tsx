"use client";
import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated login state

  // Animation for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const searchInput = (
    <Input
      aria-label="Search quizzes"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Button isIconOnly size="sm" variant="light">
          <SearchIcon className="text-base text-default-400" />
        </Button>
      }
      labelPlacement="outside"
      placeholder="Search quizzes..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  const navbarClasses = clsx(
    "transition-all duration-300",
    isScrolled ? "py-1 shadow-md bg-background/80 backdrop-blur-md" : "py-2",
  );

  return (
    <HeroUINavbar className={navbarClasses} maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-2 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <div className="bg-gradient-to-br from-primary to-secondary p-1 rounded-lg">
              <Logo />
            </div>
            <motion.p
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-inherit text-xl hidden sm:block"
              initial={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.5 }}
            >
              BrainiacWiz
            </motion.p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-6 justify-start ml-6">
          {siteConfig.navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: isActive ? "primary" : "foreground" }),
                    "font-medium relative group",
                  )}
                  href={item.href}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
                      layoutId="navbar-indicator"
                    />
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                </NextLink>
              </NavbarItem>
            );
          })}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden md:flex">{searchInput}</NavbarItem>

        <NavbarItem className="hidden sm:flex gap-3">
          <ThemeSwitch />

          {isLoggedIn ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name="User"
                  size="sm"
                  src="https://i.pravatar.cc/150?img=33"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions">
                <DropdownItem key="profile" href="/profile">
                  My Profile
                </DropdownItem>
                <DropdownItem key="dashboard" href="/host/stats">
                  My Dashboard
                </DropdownItem>
                <DropdownItem key="wallet">
                  My Wallet
                  <Badge
                    className="ml-2"
                    color="success"
                    size="sm"
                    variant="flat"
                  >
                    $25.50
                  </Badge>
                </DropdownItem>
                <DropdownItem key="settings" href="/settings">
                  Settings
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="flex gap-2">
              <Button
                as={Link}
                color="primary"
                href="/play/gamepin"
                size="sm"
                variant="flat"
              >
                Play
              </Button>
              <Button
                as={Link}
                color="secondary"
                href="/host/create"
                size="sm"
                variant="solid"
              >
                Create Quiz
              </Button>
            </div>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="pt-6">
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <Link
                  className={clsx(isActive && "text-primary font-medium")}
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                  {index === 0 && (
                    <Badge className="ml-2" color="success" size="sm">
                      New
                    </Badge>
                  )}
                </Link>
              </NavbarMenuItem>
            );
          })}

          <NavbarMenuItem className="mt-6">
            <Button
              fullWidth
              as={Link}
              className="font-medium"
              color="primary"
              href="/play/gamepin"
              size="lg"
              variant="shadow"
            >
              Join a Quiz
            </Button>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

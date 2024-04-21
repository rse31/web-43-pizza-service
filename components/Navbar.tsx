"use client"
import React from "react";
import { usePathname } from 'next/navigation'; 
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import LoginForm from "@/components/LoginForm";

function NavigationBar() {
    const pathname = usePathname(); 

    const isLinkActive = (href: string, currentPathname: string) => {
      return currentPathname === href;
    };

    return (
        <Navbar position="static">
            <NavbarBrand>
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color={isLinkActive("/", pathname) ? "primary" : "foreground"} href="/">
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color={isLinkActive("/pizza", pathname) ? "primary" : "foreground"} href="/pizza">
                        Pizza
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color={isLinkActive("/myaccount", pathname) ? "primary" : "foreground"} href="/myaccount">
                        MyAccount
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <LoginForm />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default NavigationBar;
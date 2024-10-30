"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function SideBar() {
  const links = [
    // {
    //   label: "Dashboard",
    //   href: "/dashboard",
    //   icon: <IconBrandTabler className="h-5 w-5 flex-shrink-0" aria-hidden="true" />,
    // },
    {
      label: "Submissions",
      href: "/submissions",
      icon: <IconUserBolt className="h-5 w-5 flex-shrink-0" aria-hidden="true" />,
    },
    {
      label: "Create Form",
      href: "/createform",
      icon: <IconSettings className="h-5 w-5 flex-shrink-0" aria-hidden="true" />,
    },
  ];

  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <nav className="mt-8 flex flex-col gap-2" aria-label="Sidebar navigation">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={`${
                    pathname === link.href
                      ? "bg-secondary px-1 rounded-lg"
                      : "bg-transparent px-1 rounded-lg"
                  }`}
                  aria-current={pathname === link.href ? "page" : undefined}
                />
              ))}
            </nav>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "21bubbles",
                href: "https://21bubbles.com/",
                icon: (
                  <Image
                    src="/21bubbles_logo.jpeg"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="21bubbles logo"
                    aria-hidden="true"
                  />
                ),
              }}
              aria-label="Visit 21bubbles website"
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center py-1 relative z-20"
      aria-label="AI Form Generator home"
    >
      <div
        className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
        aria-hidden="true"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre"
      >
        AI Form Generator
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <div
      className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
      aria-label="AI Form Generator logo"
    />
  );
};
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Aiforms ",
  description: "ai form generator by 21bubbles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <div className="flex justify-end absolute top-0 right-0 p-4 z-10 pointer-events-auto">
            <SignedOut>
              {/* <Link
                href="/createform"
                className="text-sm font-medium hover:underline pointer-events-auto"
              >
                <Button className="pointer-events-auto z-50">Sign In</Button>
              </Link> */}
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

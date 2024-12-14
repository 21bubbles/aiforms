import { Features } from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Steps } from "@/components/landing/Steps";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background text-text ">
      {/* <main className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Landing Page</h1>
        <p className="text-lg">Welcome to our landing page</p>
        <Link className="mt-10" href="/createform">
          <Button>Get Started</Button>
        </Link>
      </main> */}
      <Header />
      <Hero />
      <Steps />
      <Features />
      <Footer />
    </div>
  );
}

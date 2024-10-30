import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="h-auto m-5 mt-10 px-8 lg:px-16 py-5 flex flex-col items-center justify-center bg-[#1f1f1d] rounded-xl text-dark-grey">
      <div className="w-full flex flex-col lg:flex-row justify-between items-center my-10">
        <div className="text-center lg:text-left">
          <Image
            src="/21bubbles_logo.jpeg"
            width={50}
            height={50}
            alt="logo"
            className="rounded-xl mx-auto lg:mx-0"
          />
          <p className="mt-5 font-light"></p>
          <div className="flex justify-center lg:justify-start mt-5 space-x-2">
            <Link href="https://www.linkedin.com/company/21bubbles/?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3BtSCggFjPQLOOeZPAWR%2BJcw%3D%3D">
              <div className="p-2 bg-secondary rounded-lg">
                <Image
                  src="/linkedin.svg"
                  width={25}
                  height={25}
                  alt="LinkedIn"
                />
              </div>
            </Link>
            <Link href="https://x.com/21bubblesweb">
              <div className="p-2 bg-secondary rounded-lg">
                <Image src="/x.svg" width={25} height={25} alt="X" />
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col  justify-start items-start">
            <a href="#">
              <Button variant="link" className="text-neutral-400">
                Home
              </Button>
            </a>
            <a href="/createform">
              <Button variant="link" className="text-neutral-400">
                SAAS
              </Button>
            </a>
            <a href="#features">
              <Button variant="link" className="text-neutral-400">
                Features
              </Button>
            </a>
            <a href="#video">
              <Button variant="link" className="text-neutral-400">
                How To Use
              </Button>
            </a>
            <a href="https://21bubbles.com/">
              <Button variant="link" className="text-neutral-400">
                About 21bubbles
              </Button>
            </a>
            <a href="https://cal.com/anuj-bhuyar-gj0xf3/21bubbles-contact?date=2024-10-30&month=2024-10">
              <Button variant="link" className="text-neutral-400">
                Contact Us
              </Button>
            </a>
            <a href="#">
              <Button variant="link" className="text-neutral-400">
                Home
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col lg:flex-row justify-between items-center border-t border-accent pt-4 mt-4 space-y-4 lg:space-y-0">
        <p className="text-neutral-300">© 2024 21bubbles. All rights reserved.</p>
        <div className="flex space-x-4">
          {/* <Link href="/privacy-policy">
            <Button variant="link" className="text-dark-grey">
              Privacy Policy
            </Button>
          </Link>
          <Link href="/tos">
            <Button variant="link" className="text-dark-grey">
              Terms & Conditions
            </Button>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Footer;

import { Metadata } from "next";

import HomePage from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "Sambatra | Portfolio",
  description: "Sambatra's portfolio",
};

export default function Home() {
  return <HomePage />;
}

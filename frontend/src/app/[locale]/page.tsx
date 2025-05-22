"use client";

import LandingPage from "@/components/ui/LandingPage";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const currentLocale = params.locale as string;
  return <LandingPage locale={currentLocale} />;
}

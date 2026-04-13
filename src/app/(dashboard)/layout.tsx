import { DashboardLayout } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | BeautyFlow",
  description: "Gerencie sua clínica de estética com eficiência",
};

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

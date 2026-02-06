import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css'
import DashboardWrapper from "./dashboardWrapper";
import GlobalLoader from "./(components)/GlobalLoader";
import { ClerkProvider } from "@clerk/nextjs";



const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "Milestone",
  description: "Project management website created in next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
            <GlobalLoader />
            <DashboardWrapper>
              {children}
            </DashboardWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}

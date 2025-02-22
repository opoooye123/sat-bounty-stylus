import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { CampaignProvider } from "@/lib/CampaignContext"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DecentralFund - Decentralized Crowdfunding Platform",
  description: "A Kickstarter-like platform for decentralized crowdfunding using cryptocurrency.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CampaignProvider>{children}</CampaignProvider>
        <Script src="https://cdn.ethers.io/lib/ethers-5.0.umd.min.js" />
      </body>
    </html>
  )
}


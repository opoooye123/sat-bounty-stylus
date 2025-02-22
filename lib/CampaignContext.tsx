"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers"

type Campaign = {
  id: number
  title: string
  description: string
  raised: number
  goal: number
  daysLeft: number
  creator: string
}

type CampaignContextType = {
  campaigns: Campaign[]
  addCampaign: (campaign: Omit<Campaign, "id" | "raised">) => void
  updateCampaign: (id: number, amount: number) => void
  userAddress: string | null
  connectWallet: () => Promise<string | null>
}


declare global {
  interface Window {
    crypto?: Crypto
    ethereum?: ExternalProvider;
  }
}
const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export const useCampaigns = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error("useCampaigns must be used within a CampaignProvider")
  }
  return context
}

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: "Green Energy Initiative",
      description: "Funding sustainable energy projects in developing countries",
      raised: 35000,
      goal: 50000,
      daysLeft: 15,
      creator: "EcoTech Solutions",
    },
    {
      id: 2,
      title: "Ocean Cleanup Tech",
      description: "Innovative technology to remove plastic from our oceans",
      raised: 42000,
      goal: 50000,
      daysLeft: 7,
      creator: "CleanSeas Foundation",
    },
    {
      id: 3,
      title: "Education for All",
      description: "Providing access to quality education in rural areas",
      raised: 28000,
      goal: 50000,
      daysLeft: 21,
      creator: "Global Learning Initiative",
    },
  ])

  const [userAddress, setUserAddress] = useState<string | null>(null)

  const addCampaign = (campaign: Omit<Campaign, "id" | "raised">) => {
    setCampaigns((prev) => [...prev, { ...campaign, id: prev.length + 1, raised: 0 }])
  }

  const updateCampaign = (id: number, amount: number) => {
    setCampaigns((prev) =>
      prev.map((campaign) => (campaign.id === id ? { ...campaign, raised: campaign.raised + amount } : campaign)),
    )
  }

  const connectWallet = async (): Promise<string | null> => {
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
      console.error("MetaMask is not installed")
      return null
    }

    try {
      //@ts-expect-error - window.ethereum is defined
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      setUserAddress(address)
      return address
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      return null
    }
  }

  return (
    <CampaignContext.Provider value={{ campaigns, addCampaign, updateCampaign, userAddress, connectWallet }}>
      {children}
    </CampaignContext.Provider>
  )
}


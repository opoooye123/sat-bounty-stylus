"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useCampaigns } from "@/lib/CampaignContext"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ethers} from "ethers"
import { ExternalProvider } from "@ethersproject/providers";
import { CrowdFunding } from "@/utils/address";


declare global {
  interface Window {
    crypto?: Crypto
    ethereum?: ExternalProvider;
  }
}
export default function CampaignPage() {
  const { id } = useParams()
  const { campaigns, updateCampaign, userAddress, connectWallet } = useCampaigns()
  const campaign = campaigns.find((c) => c.id === Number(id))
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!campaign) {
    return <div>Campaign not found</div>
  }

  const handleDonate = async () => {
    const donationAmount = Number.parseFloat(amount)
    if (isNaN(donationAmount) || donationAmount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    setIsLoading(true)

    try {
      if (!userAddress) {
        const address = await connectWallet()
        if (!address) {
          throw new Error("Failed to connect wallet")
        }
      }

      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed")
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const tx = await signer.sendTransaction({
        to: CrowdFunding,
        value: ethers.utils.parseEther(amount),
      })

      await tx.wait()

      updateCampaign(campaign.id, donationAmount)
      setAmount("")
      alert(`Thank you for your donation of ${amount} ETH!`)
    } catch (error) {
      console.error("Transaction failed:", error)
      alert(`Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to all campaigns
      </Link>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{campaign.title}</CardTitle>
          <CardDescription>{campaign.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
          </div>
          <p className="text-lg font-semibold mb-2">
            ${campaign.raised.toLocaleString()} raised of ${campaign.goal.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mb-4">{campaign.daysLeft} days left</p>
          <p className="text-sm text-gray-500 mb-4">Created by: {campaign.creator}</p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Make a Donation</h3>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Enter amount in ETH"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-grow"
                disabled={isLoading}
              />
              <Button onClick={handleDonate} className="bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Processing..." : userAddress ? "Donate" : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            All donations are processed securely through MetaMask on the Arbitrum network.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


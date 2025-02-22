"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Facebook, Twitter, Linkedin, Rocket, PlusCircle } from "lucide-react"
import { useCampaigns } from "@/lib/CampaignContext"

export default function Home() {
  const { campaigns } = useCampaigns()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">DecentralFund</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-primary">
                  Start a Campaign
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-secondary">Featured Campaigns</h2>
          <Link href="/create">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Campaign
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-primary">{campaign.title}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                </div>
                <p className="text-lg font-semibold mb-2">
                  ${campaign.raised.toLocaleString()} raised of ${campaign.goal.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">{campaign.daysLeft} days left</p>
                <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Rocket
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-accent transition-all duration-1000 ease-in-out"
                    style={{
                      bottom: `${(campaign.raised / campaign.goal) * 100}%`,
                      width: "2rem",
                      height: "2rem",
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Link href={`/campaign/${campaign.id}`} className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">Back this project</Button>
                </Link>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>&copy; 2025 DecentralFund. All rights reserved.</p>
          <p className="mt-2">Powered by blockchain technology for transparent and secure crowdfunding.</p>
        </div>
      </footer>
    </div>
  )
}


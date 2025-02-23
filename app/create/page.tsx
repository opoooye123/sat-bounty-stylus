"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCampaigns } from "@/lib/CampaignContext"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateCampaign() {
  const router = useRouter()
  const { addCampaign } = useCampaigns()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [goal, setGoal] = useState("")
  const [daysLeft, setDaysLeft] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !goal || !daysLeft) {
      alert("Please fill in all fields")
      return
    }
    addCampaign({
      title,
      description,
      goal: Number.parseFloat(goal),
      daysLeft: Number.parseInt(daysLeft),
      creator: "Anonymous",
    })
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-primary hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to all campaigns
      </Link>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Create a New Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter campaign title"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your campaign"
                required
              />
            </div>
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                Funding Goal (ETH)
              </label>
              <Input
                id="goal"
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Enter funding goal"
                required
              />
            </div>
            <div>
              <label htmlFor="daysLeft" className="block text-sm font-medium text-gray-700">
                Campaign Duration (days)
              </label>
              <Input
                id="daysLeft"
                type="number"
                value={daysLeft}
                onChange={(e) => setDaysLeft(e.target.value)}
                placeholder="Enter campaign duration"
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90">
            Create Campaign
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


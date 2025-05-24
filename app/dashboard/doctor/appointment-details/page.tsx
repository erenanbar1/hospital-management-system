"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, User, Calendar, Clock } from "lucide-react"

export default function DoctorAppointmentDetails() {
  const patients = [{ name: "Lorem Ipsum" }, { name: "Lorem Ipsum" }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-300 to-cyan-500">
      {/* Header */}
      <header className="bg-cyan-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">Hastane</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard/doctor" className="hover:text-cyan-200">
              Schedule
            </Link>
            <Link href="/dashboard/doctor/inventory" className="hover:text-cyan-200">
              See Inventory
            </Link>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>Dr. Smith</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="h-6 w-6" />
              <Clock className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">28.03.2025 12:00 - 13:00</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-cyan-700">Patient Name</h3>
              <div className="space-y-3">
                {patients.map((patient, index) => (
                  <Card key={index} className="border-l-4 border-l-cyan-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">{patient.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                            Write Prescription
                          </Button>
                          <Button size="sm" variant="destructive">
                            Cancel
                          </Button>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                            Postpone
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center pt-8">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full" size="lg">
                Declare Unavailability and Cancel All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

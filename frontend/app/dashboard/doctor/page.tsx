"use client"

import Link from "next/link"
import { Heart, User, Calendar, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function DoctorDashboard() {
  const timeSlots = [
    { time: "06:00 - 07:00", status: "free", color: "bg-green-500" },
    { time: "07:00 - 08:00", status: "free", color: "bg-green-500" },
    { time: "08:00 - 09:00", status: "free", color: "bg-green-500" },
    { time: "09:00 - 10:00", status: "free", color: "bg-green-500" },
    { time: "10:00 - 11:00", status: "free", color: "bg-green-500" },
    { time: "11:00 - 12:00", status: "free", color: "bg-green-500" },
    { time: "12:00 - 13:00", status: "occupied", color: "bg-red-500" },
    { time: "13:00 - 14:00", status: "occupied", color: "bg-red-500" },
    { time: "14:00 - 15:00", status: "free", color: "bg-green-500" },
    { time: "15:00 - 16:00", status: "free", color: "bg-green-500" },
    { time: "16:00 - 17:00", status: "free", color: "bg-green-500" },
    { time: "17:00 - 18:00", status: "free", color: "bg-green-500" },
    { time: "18:00 - 19:00", status: "free", color: "bg-green-500" },
    { time: "19:00 - 20:00", status: "occupied", color: "bg-red-500" },
    { time: "20:00 - 21:00", status: "occupied", color: "bg-red-500" },
    { time: "21:00 - 22:00", status: "occupied", color: "bg-red-500" },
    { time: "22:00 - 23:00", status: "occupied", color: "bg-red-500" },
    { time: "23:00 - 00:00", status: "occupied", color: "bg-red-500" },
  ]

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)
  const appointmentDays = [18, 26, 28] // Days with appointments

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
            <Link href="/dashboard/doctor" className="text-cyan-200 font-semibold">
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

      <div className="max-w-6xl mx-auto p-6">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Doctor Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-semibold">March</h3>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium p-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const hasAppointment = appointmentDays.includes(day)
                    const isSelected = day === 28

                    return (
                      <Button
                        key={day}
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        className={`
                          h-10 w-10 p-0 
                          ${isSelected ? "bg-blue-500 text-white" : ""}
                          ${hasAppointment && !isSelected ? "bg-green-100 text-green-700" : ""}
                        `}
                      >
                        {day}
                      </Button>
                    )
                  })}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium">28.03.2025</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded"></div>
                      <span>Free</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded"></div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="lg:col-span-2">
                <h3 className="font-medium mb-4">Daily Schedule - 28.03.2025</h3>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${slot.color}`}></div>
                      <span className="text-sm flex-1">{slot.time}</span>
                      <Link href="/dashboard/doctor/appointment-details">
                        <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                          Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

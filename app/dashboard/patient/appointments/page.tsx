"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, User, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"

export default function PatientAppointments() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)) // March 2025

  const appointments = [
    {
      date: "14.03.2025",
      time: "15:00",
      department: "Pediatrics",
      doctor: "Lorem Ipsum",
      status: "Past",
    },
    {
      date: "04.03.2025",
      time: "14:00",
      department: "Dermatology",
      doctor: "Lorem Ipsum",
      status: "Upcoming",
    },
  ]

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)
  const appointmentDays = [14, 26, 29] // Days with appointments

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
            <Link href="/dashboard/patient" className="hover:text-cyan-200">
              Home
            </Link>
            <Link href="/dashboard/patient/appointments" className="text-cyan-200 font-semibold">
              My Appointments
            </Link>
            <Link href="/dashboard/patient/health-card" className="hover:text-cyan-200">
              Health Card
            </Link>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>John Doe</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              My Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-8">
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
                    const isToday = day === 26
                    const isPast = day === 14
                    const isUpcoming = day === 29

                    return (
                      <Button
                        key={day}
                        variant={hasAppointment ? "default" : "ghost"}
                        size="sm"
                        className={`
                          h-10 w-10 p-0 
                          ${isToday ? "bg-blue-500 text-white" : ""}
                          ${isPast ? "bg-red-500 text-white" : ""}
                          ${isUpcoming ? "bg-green-500 text-white" : ""}
                          ${!hasAppointment ? "hover:bg-gray-100" : ""}
                        `}
                      >
                        {day}
                      </Button>
                    )
                  })}
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Occupied</span>
                  </div>
                </div>
              </div>

              {/* Appointment List */}
              <div className="space-y-4">
                {appointments.map((appointment, index) => (
                  <Card key={index} className="border-l-4 border-l-cyan-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{appointment.date}</span>
                          <span className="text-gray-500">{appointment.time}</span>
                        </div>
                        <Badge
                          variant={appointment.status === "Past" ? "destructive" : "default"}
                          className={appointment.status === "Upcoming" ? "bg-green-500" : ""}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Department: {appointment.department}</p>
                        <p className="text-gray-600">Doctor: {appointment.doctor}</p>
                      </div>
                      {appointment.status === "Upcoming" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                            Send Feedback
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/dashboard/patient/book-appointment">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full">
                  Book An Appointment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

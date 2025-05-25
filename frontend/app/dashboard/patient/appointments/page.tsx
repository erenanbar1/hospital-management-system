"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, User, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useUser } from "@/hooks/use-user"

export default function PatientAppointments() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [appointmentDays, setAppointmentDays] = useState<number[]>([])

  const { userId } = useUser()

  // Fetch appointments when component mounts
  useEffect(() => {
    if (userId) {
      fetchAppointments(userId)
    }
  }, [userId])

  const fetchAppointments = async (patientId: string | number) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://localhost:8000/api/get_appointments/${patientId}/`)
      const data = await response.json()

      if (data.success && Array.isArray(data.appointments)) {
        // Transform the API response to match our component's data structure
        const formattedAppointments = data.appointments.map((apt: {
          date: string;
          starttime?: string;
          department: string;
          doctor_name: string;
        }) => {
          // Extract date parts
          const dateObj = new Date(apt.date)
          const day = dateObj.getDate().toString().padStart(2, '0')
          const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
          const year = dateObj.getFullYear()

          // Format time for display (assuming starttime is in HH:MM:SS format)
          const timeFormatted = apt.starttime ? apt.starttime.substring(0, 5) : ""

          // Determine if appointment is in the past or upcoming
          const today = new Date()
          const isPast = dateObj < today

          return {
            date: `${day}.${month}.${year}`,
            time: timeFormatted,
            department: apt.department,
            doctor: apt.doctor_name,
            status: isPast ? "Past" : "Upcoming",
            rawDate: dateObj
          }
        })

        setAppointments(formattedAppointments)

        // Extract days of month for appointments in the current month
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()

        const days = formattedAppointments
          .filter((apt: { rawDate: Date }) => {
            const aptDate = apt.rawDate
            return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear
          })
          .map((apt: { rawDate: Date }) => apt.rawDate.getDate())

        setAppointmentDays(days)
      } else {
        setError("Failed to load appointments")
        setAppointments([])
        setAppointmentDays([])
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setError("Failed to load appointments")
      setAppointments([])
      setAppointmentDays([])
    } finally {
      setLoading(false)
    }
  }

  // Get the current month name
  const getMonthName = () => {
    return currentDate.toLocaleString('default', { month: 'long' })
  }

  // Navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  // Calculate days in current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    return new Date(year, month, 0).getDate()
  }

  const calendarDays = Array.from({ length: getDaysInMonth() }, (_, i) => i + 1)

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            My Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Button variant="ghost" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-semibold">{getMonthName()}</h3>
                  <Button variant="ghost" size="sm" onClick={nextMonth}>
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
                    const todayHighlight = isToday(day)

                    // Find appointments for this day to determine if any are past/upcoming
                    const dayAppointments = appointments.filter(apt => {
                      return apt.rawDate.getDate() === day &&
                        apt.rawDate.getMonth() === currentDate.getMonth() &&
                        apt.rawDate.getFullYear() === currentDate.getFullYear()
                    })

                    const hasPast = dayAppointments.some(apt => apt.status === "Past")
                    const hasUpcoming = dayAppointments.some(apt => apt.status === "Upcoming")

                    return (
                      <Button
                        key={day}
                        variant={hasAppointment ? "default" : "ghost"}
                        size="sm"
                        className={`
                          h-10 w-10 p-0 
                          ${todayHighlight ? "bg-blue-500 text-white" : ""}
                          ${hasPast && !todayHighlight ? "bg-red-500 text-white" : ""}
                          ${hasUpcoming && !todayHighlight ? "bg-green-500 text-white" : ""}
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
                    <span>Upcoming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Past</span>
                  </div>
                </div>
              </div>

              {/* Appointment List */}
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No appointments found
                  </div>
                ) : (
                  appointments.map((appointment, index) => (
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
                  ))
                )}
              </div>
            </div>
          )}

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
  )
}
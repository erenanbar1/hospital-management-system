"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DoctorAppointment {
  patient_name: string;
  date: string;
  starttime?: string;
  endtime?: string;
}

interface DoctorScheduleCalendarProps {
  userId: string
  onDateSelect: (date: string) => void
  appointments?: DoctorAppointment[]
}

export function DoctorScheduleCalendar({ userId, onDateSelect, appointments = [] }: DoctorScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get days with appointments
  const appointmentDays = appointments.reduce<number[]>((days, appointment) => {
    const date = new Date(appointment.date)
    if (
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    ) {
      days.push(date.getDate())
    }
    return days
  }, [])

  // Get month name
  const getMonthName = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const daysInMonth = lastDayOfMonth.getDate()
    const startingDayOfWeek = firstDayOfMonth.getDay() || 7 // Convert Sunday (0) to 7

    const days: number[] = []

    // Add empty days for padding
    for (let i = 1; i < startingDayOfWeek; i++) {
      days.push(0) // Use 0 to indicate empty day
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const calendarDays = getCalendarDays()

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  // Format date for the API
  const formatDateForApi = (day: number) => {
    const date = new Date(currentDate)
    date.setDate(day)
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-medium text-center">{getMonthName()}</h3>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center text-xs font-medium p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === 0) {
            return <div key={index} className="h-8 w-8" />
          }

          const hasAppointment = appointmentDays.includes(day)
          const todayHighlight = isToday(day)

          return (
            <Button
              key={index}
              variant={hasAppointment ? "default" : "ghost"}
              size="sm"
              className={`
                h-8 w-8 p-0 
                ${todayHighlight ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                ${hasAppointment && !todayHighlight ? "bg-green-500 text-white hover:bg-green-600" : ""}
              `}
              onClick={() => onDateSelect(formatDateForApi(day))}
            >
              {day}
            </Button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Has Appointments</span>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DoctorScheduleCalendarProps {
  userId: string
  onDateSelect: (date: string) => void
}

export function DoctorScheduleCalendar({ userId, onDateSelect }: DoctorScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Get current month days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  // Calculate the day of the week for the first day of the month (0-6, where 0 is Sunday)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  
  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }
  
  const handleDateClick = (day: number) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(newSelectedDate)
    
    // Format as YYYY-MM-DD and account for timezone offset
    const year = newSelectedDate.getFullYear();
    const month = String(newSelectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayStr}`;
    
    onDateSelect(formattedDate)
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-start-${i}`} className="p-2" />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          const isSelected = selectedDate?.toDateString() === date.toDateString()
          const isToday = new Date().toDateString() === date.toDateString()

          return (
            <Button
              key={day}
              variant={isSelected ? "default" : "ghost"}
              className={`
                h-10 w-full p-0 
                ${isSelected ? "bg-blue-500 text-white" : ""}
                ${isToday ? "border border-blue-500" : ""}
              `}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
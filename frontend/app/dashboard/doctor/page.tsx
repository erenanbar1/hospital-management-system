"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { DoctorScheduleCalendar } from "@/components/DoctorScheduleCalendar"
import { useUser } from "@/lib/hooks/useUser"
import axios from "axios"
import { useRouter } from "next/navigation"

interface TimeSlot {
  ts_id: string
  start_time: string
  end_time: string
}

export default function DoctorDashboard() {
  const router = useRouter()
  const { userId, userRole } = useUser()
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Redirect non-doctors or unauthenticated users
  useEffect(() => {
    if (userRole && userRole !== "doctor") {
      router.push("/dashboard")
    }
  }, [userRole, router])

  // Add useEffect to trigger API call when date changes or on initial load
  useEffect(() => {
    // Use U0006 as a fallback ID for testing purposes if userId is not available
    const doctorId = userId || 'U0006'
    if (selectedDate) {
      fetchAvailableSlots(doctorId)
    }
  }, [selectedDate, userId])

  const fetchAvailableSlots = async (docId: string) => {
    try {
      setIsLoading(true)
      console.log(`Fetching slots for doctor: ${docId}, date: ${selectedDate}`)
      
      const response = await axios.get<{ success: boolean; timeslots: TimeSlot[] }>(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/list_available_timeslots_of_doctor/?doc_id=${docId}&date=${selectedDate}`
      )
      
      console.log('API response:', response.data)
      
      if (response.data.success) {
        const availableTsIds = response.data.timeslots.map(slot => slot.ts_id)
        setAvailableSlots(availableTsIds)
        console.log('Available slots set:', availableTsIds)
      }
    } catch (error) {
      console.error('Error fetching available slots:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateSelect = (date: string) => {
    console.log('Date selected:', date)
    setSelectedDate(date)
  }

  // Format selected date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "No date selected"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Remove the conditional return for no userId
  // Instead, we'll use a fallback ID for demo/testing purposes
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Doctor Schedule {userId ? `(${userId})` : '(Demo Mode)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-8">
            <DoctorScheduleCalendar
              userId={userId || 'U0006'}
              onDateSelect={handleDateSelect}
            />

            {/* Time Slots Display */}
            <div className="lg:col-span-2">
              <h3 className="font-medium mb-4">
                Daily Schedule - {formatDisplayDate(selectedDate)}
                <span className="text-sm text-gray-500 ml-2">(8:00 AM - 5:00 PM)</span>
                {availableSlots.length > 0 && (
                  <span className="text-sm text-green-500 ml-2">
                    ({availableSlots.length} available slots)
                  </span>
                )}
              </h3>
              
              {isLoading ? (
                <div className="text-center py-10">Loading schedule...</div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {/* Generate time slots from 8:00 AM to 5:00 PM (17:00) */}
                  {Array.from({ length: 18 }).map((_, index) => {
                    // IMPORTANT: Start from TS001, TS002, etc. to match the API
                    const slotNumber = index + 1
                    const tsId = `TS${String(slotNumber).padStart(3, '0')}`
                    
                    // Calculate time display - start at 8:00 AM
                    const startHour = Math.floor((index + 16) / 2)
                    const startMin = (index + 16) % 2 === 0 ? "00" : "30"
                    const endHour = Math.floor((index + 17) / 2)
                    const endMin = (index + 17) % 2 === 0 ? "00" : "30"
                    
                    // Format for 12-hour display
                    const formatTime = (hour: number, min: string) => {
                      const period = hour >= 12 ? 'PM' : 'AM'
                      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                      return `${displayHour}:${min} ${period}`
                    }
                    
                    const isAvailable = availableSlots.includes(tsId)
                    
                    return (
                      <div
                        key={tsId}
                        className={`p-3 rounded-lg ${
                          isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500'
                        } text-white text-sm transition-colors cursor-pointer`}
                        title={`Time Slot: ${tsId}`}
                      >
                        <div className="font-medium">
                          {formatTime(startHour, startMin)}
                        </div>
                        <div className="text-xs opacity-90">
                          to {formatTime(endHour, endMin)}
                        </div>
                        <div className="text-xs mt-1 opacity-75">
                          {tsId}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

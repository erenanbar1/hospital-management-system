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

interface DoctorAppointment {
  patient_name: string;
  date: string;
  starttime?: string;  // Alternative property names from API
  endtime?: string;
}

export default function DoctorDashboard() {
  const router = useRouter()
  const { userId, userRole } = useUser()
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [doctorAppointments, setDoctorAppointments] = useState<DoctorAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false);

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
      fetchDoctorAppointments(doctorId);
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

  const fetchDoctorAppointments = async (docId: string) => {
    try {
      setLoadingAppointments(true);
      const response = await axios.get<{ success: boolean; appointments: DoctorAppointment[] }>(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/get_doctor_appointments/${docId}/`
      );

      if (response.data.success) {
        const currentDate = new Date();
        // Filter out past appointments and keep only upcoming ones
        const upcomingAppointments = response.data.appointments.filter(appointment => {
          const appointmentDateTime = new Date(appointment.date + (appointment.starttime ? 'T' + appointment.starttime : ''));
          return appointmentDateTime >= currentDate;
        });

        // Sort upcoming appointments by date (closest to furthest)
        const sortedAppointments = upcomingAppointments.sort((a, b) => {
          const dateA = new Date(a.date + (a.starttime ? 'T' + a.starttime : ''));
          const dateB = new Date(b.date + (b.starttime ? 'T' + b.starttime : ''));
          return dateA.getTime() - dateB.getTime();
        });

        setDoctorAppointments(sortedAppointments);
      }
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

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
            Doctor Schedule {userId && `(${userId})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-8">
            <DoctorScheduleCalendar
              userId={userId || 'U0006'}
              onDateSelect={handleDateSelect}
              appointments={doctorAppointments}
            />

            {/* Time Slots Display */}
            <div className="lg:col-span-2">
              <h3 className="font-medium mb-4">
                Daily Schedule - {formatDisplayDate(selectedDate)}
                <span className="text-sm text-gray-500 ml-2">(8:00 AM - 1:00 PM)</span>
                {availableSlots.length > 0 && (
                  <span className="text-sm text-green-500 ml-2">
                    ({availableSlots.length} available slots)
                  </span>
                )}
              </h3>

              {isLoading ? (
                <div className="text-center py-10">Loading schedule...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Generate only 10 time slots from 8:00 AM to 12:30 PM */}
                  {Array.from({ length: 10 }).map((_, index) => {
                    // Start from TS001, TS002, etc. to match the API
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
                        className={`
                          p-4 rounded-lg border shadow-sm
                          ${isAvailable
                            ? 'bg-green-50 border-green-200 hover:bg-green-100'
                            : 'bg-red-50 border-red-200'
                          } 
                          transition-colors cursor-pointer
                        `}
                        title={`Time Slot: ${tsId}`}
                      >
                        <div className="flex justify-center items-center mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="font-medium text-center">
                          {formatTime(startHour, startMin)}
                          <span className="mx-1">-</span>
                          {formatTime(endHour, endMin)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Appointments Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold text-lg mb-4">Upcoming Appointments</h3>

            {loadingAppointments ? (
              <div className="text-center py-6">Loading appointments...</div>
            ) : doctorAppointments.length > 0 ? (
              <div className="bg-white rounded-md shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctorAppointments.map((appointment, index) => {
                      // Format the date for display
                      const appointmentDate = new Date(appointment.date);
                      const formattedDate = appointmentDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });

                      // Format the time - check both possible property names
                      const startTime = appointment.starttime || appointment.starttime || 'N/A';
                      const endTime = appointment.endtime || appointment.endtime || 'N/A';

                      // Only take the hours and minutes (HH:MM) part if it exists
                      const formattedStartTime = startTime !== 'N/A' ? startTime.substring(0, 5) : 'N/A';
                      const formattedEndTime = endTime !== 'N/A' ? endTime.substring(0, 5) : 'N/A';

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{appointment.patient_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {formattedDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {formattedStartTime} - {formattedEndTime}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-md">
                <p className="text-gray-500">No upcoming appointments found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

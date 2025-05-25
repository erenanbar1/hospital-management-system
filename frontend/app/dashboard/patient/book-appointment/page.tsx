"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, User, ChevronLeft, ChevronRight, Calendar, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Doctor {
  doctor_id: string
  doctor_name: string
  doctor_surname: string
  specialization: string
  rating: number
  price: number
}

interface TimeSlot {
  ts_id: string
  start_time: string
  end_time: string
}

export default function BookAppointment() {
  // Get patient ID from localStorage
  const [patientId, setPatientId] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [lastBalanceUpdate, setLastBalanceUpdate] = useState<Date | null>(null)

  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Initialize patient ID from localStorage
  useEffect(() => {
    const storedPatientId = localStorage.getItem("userId") || localStorage.getItem("u_id")
    if (storedPatientId) {
      setPatientId(storedPatientId)
    }
  }, [])

  // Fetch patient balance
  const fetchBalance = async () => {
    if (!patientId) return
    
    setBalanceLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/get_patient_balance/${patientId}/`)
      const data = await response.json()

      if (data.success) {
        setBalance(data.balance)
        setLastBalanceUpdate(new Date())
      } else {
        setError("Failed to fetch balance: " + data.message)
      }
    } catch (err) {
      setError("Error fetching balance: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setBalanceLoading(false)
    }
  }

  // Fetch balance when patient ID is available
  useEffect(() => {
    if (patientId) {
      fetchBalance()
    }
  }, [patientId])

  // Auto-refresh balance every 30 seconds
  useEffect(() => {
    if (!patientId) return
    
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [patientId])

  // Refresh balance when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && patientId) {
        fetchBalance()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [patientId])

  // Get month name
  const getMonthName = () => {
    return selectedDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })
  }

  // Navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setSelectedDate(newDate)
  }

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setSelectedDate(newDate)
  }

  // Format date for API request (YYYY-MM-DD)
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // Get days in current month
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth() + 1
    return new Date(year, month, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    return new Date(year, month, 1).getDay() || 7 // Convert Sunday (0) to 7 for EU calendar format
  }

  // Select a specific day
  const selectDay = (day: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(day)
    setSelectedDate(newDate)

    // If doctor is already selected, fetch available time slots for this date
    if (selectedDoctor) {
      fetchAvailableTimeSlots(selectedDoctor, newDate)
    }
  }

  // Fetch doctors by department
  useEffect(() => {
    if (selectedDepartment) {
      setLoading(true)
      setError("")

      fetch(`http://localhost:8000/api/filter_doctors_by_dept/?dept_name=${selectedDepartment}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setDoctors(data.doctors)
          } else {
            setError(data.message || "Failed to fetch doctors")
            setDoctors([])
          }
        })
        .catch(err => {
          setError("Error fetching doctors: " + err.message)
          setDoctors([])
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setDoctors([])
    }
  }, [selectedDepartment])

  // Fetch available time slots when doctor or date changes
  const fetchAvailableTimeSlots = (doctorId: string, date: Date) => {
    setLoading(true)
    setError("")
    setAvailableTimeSlots([])

    const formattedDate = formatDateForAPI(date)

    fetch(`http://localhost:8000/api/list_available_timeslots_of_doctor/?doc_id=${doctorId}&date=${formattedDate}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setAvailableTimeSlots(data.timeslots)
        } else {
          setError(data.message || "Failed to fetch available time slots")
        }
      })
      .catch(err => {
        setError("Error fetching time slots: " + err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // When doctor selection changes
  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailableTimeSlots(selectedDoctor, selectedDate)
    } else {
      setAvailableTimeSlots([])
    }
  }, [selectedDoctor])

  // Handle time slot selection
  const handleTimeSlotSelection = (tsId: string) => {
    setSelectedTimeSlot(tsId)
  }

  // Handle appointment booking
  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedTimeSlot || !patientId) {
      setError("Please select a doctor and time slot")
      return
    }

    setLoading(true)
    setError("")

    const appointmentData = {
      patient_id: patientId,
      doc_id: selectedDoctor,
      ts_id: selectedTimeSlot,
      date: formatDateForAPI(selectedDate)
    }

    fetch('http://localhost:8000/api/make_appointment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSuccessMessage("Appointment booked successfully!")
          setSelectedTimeSlot("")
          // Refresh available time slots
          fetchAvailableTimeSlots(selectedDoctor, selectedDate)
          // Refresh balance after successful booking
          fetchBalance()
        } else {
          setError(data.message || "Failed to book appointment")
        }
      })
      .catch(err => {
        setError("Error booking appointment: " + err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Format time for display (convert "00:00:00" to "00:00")
  const formatTime = (time: string) => {
    return time.substring(0, 5)
  }

  // Get selected doctor's price
  const getSelectedDoctorPrice = (): number => {
    const doctor = doctors.find(d => d.doctor_id === selectedDoctor)
    return doctor?.price || 0
  }

  // Format price for display
  const formatPrice = (price: number): string => {
    return Number(price).toFixed(2)
  }

  // Generate calendar days with proper offset for first day of month
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth()
    const firstDay = getFirstDayOfMonth()

    // Create array for all days in month
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    // Add empty cells for days before the first day of month
    const emptyCells = Array.from({ length: firstDay - 1 }, () => null)

    return [...emptyCells, ...days]
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-300 to-cyan-500">
      <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                <h2 className="text-xl font-bold">Book an Appointment</h2>
              </div>
              
              {/* Balance Display */}
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-sm">
                  <span className="text-gray-600">Balance: </span>
                  <span className="font-bold text-green-600">
                    {balanceLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin inline" />
                    ) : balance !== null ? (
                      `$${formatPrice(balance)}`
                    ) : (
                      "Loading..."
                    )}
                  </span>
                </div>
                <button
                  onClick={fetchBalance}
                  disabled={balanceLoading}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  title="Refresh balance"
                >
                  <RefreshCw className={`h-4 w-4 ${balanceLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            
            {lastBalanceUpdate && (
              <div className="text-xs text-gray-500 mb-4 text-right">
                Last updated: {lastBalanceUpdate.toLocaleTimeString()}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column - Selection */}
              <div>
                <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Department</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="bg-cyan-50">
                    <SelectValue placeholder="Choose department" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Make sure these match exactly with your backend values */}
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Doctor</label>
                <Select
                  value={selectedDoctor}
                  onValueChange={setSelectedDoctor}
                  disabled={loading || !doctors.length}
                >
                    <SelectTrigger className="bg-cyan-50">
                    <SelectValue placeholder={
                      loading ? "Loading..." :
                        !selectedDepartment ? "Select a department first" :
                          !doctors.length ? "No doctors available" :
                            "Choose doctor"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem
                        key={doctor.doctor_id}
                          value={doctor.doctor_id}
                      >
                        Dr. {doctor.doctor_name} {doctor.doctor_surname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="text-gray-500 hover:text-gray-700">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h3 className="font-medium text-center">{getMonthName()}</h3>
                    <button onClick={nextMonth} className="text-gray-500 hover:text-gray-700">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium p-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      if (day === null) {
                        return <div key={`empty-${index}`} className="h-8 w-8"></div>
                      }

                      const isSelected = day === selectedDate.getDate()
                      const isToday = day === new Date().getDate() &&
                        selectedDate.getMonth() === new Date().getMonth() &&
                        selectedDate.getFullYear() === new Date().getFullYear()

                    return (
                        <button
                        key={day}
                          onClick={() => selectDay(day)}
                          className={`
                            h-8 w-8 rounded-full text-xs flex items-center justify-center
                            ${isSelected ? 'bg-blue-500 text-white' : ''}
                            ${isToday && !isSelected ? 'border border-blue-500' : ''}
                            ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
                          `}
                      >
                        {day}
                        </button>
                    )
                  })}
                </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded flex items-center gap-4">
                    <p className="text-sm font-medium">{formatDateForAPI(selectedDate)}</p>
                    <div className="flex items-center gap-4 text-xs ml-auto">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span>Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Time Slots */}
            <div>
              <h3 className="font-medium mb-4">Available Time Slots</h3>

                <div className="bg-white p-4 rounded-md border border-gray-200 min-h-[300px]">
                  {loading ? (
                    <div className="text-center py-8">Loading time slots...</div>
                  ) : !selectedDoctor ? (
                    <div className="text-center py-8 text-gray-500">
                      Please select a doctor to see available time slots
                    </div>
                  ) : availableTimeSlots.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No available time slots for this date
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot.ts_id}
                    className={`
                            py-2 px-3 rounded-md border text-sm
                            ${selectedTimeSlot === slot.ts_id
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 hover:bg-gray-50'}
                    `}
                          onClick={() => handleTimeSlotSelection(slot.ts_id)}
                        >
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </button>
                ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Appointment Details */}
              <div>
                <h3 className="font-medium mb-4">Appointment Details</h3>

                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="space-y-4">
                  <div>
                      <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{selectedDepartment || "Not selected"}</p>
                  </div>

                  <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">
                        {selectedDoctor
                          ? doctors.find(d => d.doctor_id === selectedDoctor)
                            ? `Dr. ${doctors.find(d => d.doctor_id === selectedDoctor)?.doctor_name} ${doctors.find(d => d.doctor_id === selectedDoctor)?.doctor_surname
                            }`
                            : "Not found"
                        : "Not selected"}
                    </p>
                  </div>

                  <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDateForAPI(selectedDate)}</p>
                  </div>

                  <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">
                        {selectedTimeSlot
                          ? `${formatTime(
                            availableTimeSlots.find(s => s.ts_id === selectedTimeSlot)?.start_time || ""
                          )} - ${formatTime(
                            availableTimeSlots.find(s => s.ts_id === selectedTimeSlot)?.end_time || ""
                          )}`
                          : "Not selected"}
                      </p>
                  </div>

                    {selectedDoctor && (
                  <div>
                        <p className="text-sm text-gray-500">Appointment Fee</p>
                        <p className="font-medium text-blue-600">
                          ${getSelectedDoctorPrice() > 0 ? formatPrice(getSelectedDoctorPrice()) : "N/A"}
                        </p>
                      </div>
                    )}

                    {selectedDoctor && balance !== null && (
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between text-sm">
                          <span>Current Balance:</span>
                          <span className="font-medium">${formatPrice(balance)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Appointment Fee:</span>
                          <span className="font-medium">-${formatPrice(getSelectedDoctorPrice())}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between text-sm font-bold">
                          <span>Remaining Balance:</span>
                          <span className={
                            (balance - getSelectedDoctorPrice()) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }>
                            ${formatPrice(balance - getSelectedDoctorPrice())}
                          </span>
                        </div>
                        {(balance - getSelectedDoctorPrice()) < 0 && (
                          <p className="text-xs text-red-600 mt-2">
                            Insufficient balance for this appointment
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      className={`
                        w-full py-2 px-4 rounded-md text-white font-medium
                        ${(!selectedDoctor || !selectedTimeSlot || loading)
                          ? 'bg-blue-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'}
                      `}
                      disabled={!selectedDoctor || !selectedTimeSlot || loading}
                      onClick={handleBookAppointment}
                    >
                      {loading ? "Processing..." : "Book Appointment"}
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
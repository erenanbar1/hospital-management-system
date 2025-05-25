"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Calendar, ChevronLeft, ChevronRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookAppointment() {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  
  interface Doctor {
    doctor_id: number;
    doctor_name: string;
    doctor_surname: string;
    price?: string | number;
  }
  
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)

  const timeSlots = [
    { time: "08:00 - 07:00", status: "choose", available: true },
    { time: "07:00 - 08:00", status: "choose", available: true },
    { time: "08:00 - 09:00", status: "choose", available: true },
    { time: "09:00 - 10:00", status: "choose", available: true },
    { time: "10:00 - 11:00", status: "choose", available: true },
    { time: "11:00 - 12:00", status: "occupied", available: false },
    { time: "12:00 - 13:00", status: "occupied", available: false },
    { time: "13:00 - 14:00", status: "occupied", available: false },
    { time: "14:00 - 15:00", status: "choose", available: true },
    { time: "15:00 - 16:00", status: "choose", available: true },
    { time: "16:00 - 17:00", status: "choose", available: true },
    { time: "17:00 - 18:00", status: "choose", available: true },
    { time: "18:00 - 19:00", status: "choose", available: true },
    { time: "19:00 - 20:00", status: "occupied", available: false },
    { time: "20:00 - 21:00", status: "occupied", available: false },
    { time: "21:00 - 22:00", status: "occupied", available: false },
    { time: "22:00 - 23:00", status: "occupied", available: false },
    { time: "23:00 - 00:00", status: "occupied", available: false },
  ]

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)

  // Function to fetch doctors by department
  const fetchDoctorsByDepartment = async (deptName: string) => {
    if (!deptName) return;

    setLoading(true);
    console.log("Fetching doctors for department:", deptName);

    try {
      // Make API request to your backend
      const response = await fetch(`http://localhost:8000/api/filter_doctors_by_dept/?dept_name=${encodeURIComponent(deptName)}`);
      const data = await response.json();

      console.log("API Response:", data);

      if (data.success && Array.isArray(data.doctors)) {
        setDoctors(data.doctors);
      } else {
        console.error("API error:", data.message || "Unknown error");
        setDoctors([]);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Update doctors list when department changes
  const handleDepartmentChange = (deptName: string) => {
    console.log("Department selected:", deptName);
    setSelectedDepartment(deptName);
    setSelectedDoctor(""); // Reset doctor selection
    fetchDoctorsByDepartment(deptName);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Book New Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Selections */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Department</label>
                <Select
                  value={selectedDepartment}
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger className="bg-cyan-100">
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

              <div>
                <label className="block text-sm font-medium mb-2">Select Doctor</label>
                <Select
                  value={selectedDoctor}
                  onValueChange={setSelectedDoctor}
                  disabled={loading || !doctors.length}
                >
                  <SelectTrigger className="bg-cyan-100">
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
                        value={String(doctor.doctor_id)}
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
                    <div key={day} className="text-center text-xs font-medium p-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const isSelected = day === 28
                    return (
                      <Button
                        key={day}
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs ${isSelected ? "bg-blue-500 text-white" : ""}`}
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
            </div>

            {/* Middle Column - Time Slots */}
            <div>
              <h3 className="font-medium mb-4">Available Time Slots</h3>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={slot.available ? "outline" : "secondary"}
                    size="sm"
                    disabled={!slot.available}
                    className={`
                      text-xs h-8
                      ${slot.available ? "hover:bg-green-50 border-green-300" : "bg-red-100 text-red-600"}
                    `}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{selectedDepartment || "Not selected"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium">
                      {selectedDoctor && doctors.length > 0
                        ? (() => {
                          const doctor = doctors.find(d => String(d.doctor_id) === selectedDoctor);
                          return doctor ? `Dr. ${doctor.doctor_name} ${doctor.doctor_surname}` : "Not selected";
                        })()
                        : "Not selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">28.03.2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">{selectedTime || "14:00 - 15:00"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="font-medium">xx</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Appointment Price</p>
                    <p className="font-medium">
                      {selectedDoctor && doctors.length > 0
                        ? (() => {
                          const doctor = doctors.find(d => String(d.doctor_id) === selectedDoctor);
                          return doctor && doctor.price ? doctor.price : "xxx";
                        })()
                        : "xxx"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={!selectedDoctor || !selectedDepartment || !selectedTime}
              >
                Save Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
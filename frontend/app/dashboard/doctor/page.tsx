"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Package, Search, AlertCircle, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DoctorScheduleCalendar } from "@/components/DoctorScheduleCalendar"
import { useUser } from "@/lib/hooks/useUser"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useInventoryScroll } from "@/lib/hooks/useInventoryScroll"

interface TimeSlot {
  ts_id: string
  start_time: string
  end_time: string
}

interface DoctorAppointment {
  patient_name: string;
  date: string;
  starttime?: string;
  endtime?: string;
}

// Interface for inventory items to match the API response
interface InventoryItem {
  id: string;
  name: string;
  format: string;
  amount: string;
}

export default function DoctorDashboard() {
  const router = useRouter()
  const { userId, userRole } = useUser()
  const { inventoryRef, scrollToInventory } = useInventoryScroll()
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [doctorAppointments, setDoctorAppointments] = useState<DoctorAppointment[]>([])
  const [pastAppointments, setPastAppointments] = useState<DoctorAppointment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false)

  // Inventory state
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [loadingInventory, setLoadingInventory] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [inventoryError, setInventoryError] = useState<string>("")

  // Unavailability declaration state
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [declareLoading, setDeclareLoading] = useState(false)
  const [declareError, setDeclareError] = useState<string>("")
  const [declareSuccess, setDeclareSuccess] = useState<string>("")

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

  // Fetch inventory immediately on component mount, not just when tab changes
  useEffect(() => {
    fetchInventoryItems();
  }, []);

  // Add this to your useEffect section:
  useEffect(() => {
    // Set up event listener for scrollToInventory event
    const handleScrollToInventory = () => {
      inventoryRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    document.addEventListener('scrollToInventory', handleScrollToInventory)

    // Clean up
    return () => {
      document.removeEventListener('scrollToInventory', handleScrollToInventory)
    }
  }, [])

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
        const currentDateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

        // Separate past and upcoming appointments
        const past: DoctorAppointment[] = [];
        const upcoming: DoctorAppointment[] = [];

        response.data.appointments.forEach(appointment => {
          // Properly compare dates accounting for time component
          const appointmentDate = new Date(appointment.date);
          const appointmentDateStr = appointmentDate.toISOString().split('T')[0];

          // For appointments today, check the time
          if (appointmentDateStr === currentDateStr && appointment.starttime) {
            const [hours, minutes] = appointment.starttime.split(':');
            const appointmentTime = new Date();
            appointmentTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

            if (appointmentTime > currentDate) {
              upcoming.push(appointment);
            } else {
              past.push(appointment);
            }
          }
          // For appointments on different days, compare dates
          else if (appointmentDateStr < currentDateStr) {
            past.push(appointment);
          } else {
            upcoming.push(appointment);
          }
        });

        // Sort past appointments by date (most recent first)
        const sortedPastAppointments = past.sort((a, b) => {
          const dateA = new Date(a.date + (a.starttime ? 'T' + a.starttime : ''));
          const dateB = new Date(b.date + (b.starttime ? 'T' + b.starttime : ''));
          return dateB.getTime() - dateA.getTime();
        });

        // Sort upcoming appointments by date (closest first)
        const sortedUpcomingAppointments = upcoming.sort((a, b) => {
          const dateA = new Date(a.date + (a.starttime ? 'T' + a.starttime : ''));
          const dateB = new Date(b.date + (b.starttime ? 'T' + b.starttime : ''));
          return dateA.getTime() - dateB.getTime();
        });

        setDoctorAppointments(sortedUpcomingAppointments);
        setPastAppointments(sortedPastAppointments);
      }
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      setDoctorAppointments([]);
      setPastAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Updated fetchInventoryItems function with direct URL
  const fetchInventoryItems = async () => {
    try {
      setLoadingInventory(true);
      setInventoryError("");

      // Use a simple direct URL here for testing
      const apiUrl = "http://localhost:8000/api/equipment/";

      console.log("Fetching inventory from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Full API response:", data);

      if (data && data.success) {
        setInventoryItems(data.equipment);
        console.log("Successfully loaded inventory from API:", data.equipment);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventoryError(`Failed to load inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);

      // Fall back to mock data
      console.log("Using mock inventory data as fallback");
      setInventoryItems([
        { id: "ME001", name: "Syringe", format: "Piece", amount: "100" },
        { id: "ME002", name: "Stethoscope", format: "Piece", amount: "20" },
        { id: "ME003", name: "Gloves", format: "Box", amount: "50" }
      ]);
    } finally {
      setLoadingInventory(false);
    }
  };

  const declareUnavailability = async () => {
    if (!selectedSlot) return

    setDeclareLoading(true)
    setDeclareError("")
    setDeclareSuccess("")

    try {
      const doctorId = userId || 'U0006'

      const response = await fetch("http://localhost:8000/api/doctor_declare_unavailability/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ts_id: selectedSlot,
          doc_id: doctorId,
          date: selectedDate,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setDeclareSuccess(`Successfully marked as unavailable. (ID: ${data.ua_id})`)
        // Refresh the schedule to reflect the changes
        fetchAvailableSlots(doctorId)
        setConfirmDialogOpen(false)
      } else {
        setDeclareError(data.message || "Failed to mark as unavailable")
      }
    } catch (error) {
      console.error("Error declaring unavailability:", error)
      setDeclareError("An error occurred while marking unavailability")
    } finally {
      setDeclareLoading(false)
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

  const getTimeIntervalForSlot = (tsId: string): string => {
    // Extract the number from the TS format
    const slotNumber = parseInt(tsId.replace('TS', ''), 10);
    if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 10) {
      return 'Unknown time';
    }

    // Calculate time display for 10 slots between 8:00 AM and 1:00 PM
    const startHour = 8 + Math.floor((slotNumber - 1) / 2);
    const startMin = (slotNumber - 1) % 2 === 0 ? "00" : "30";
    const endHour = startHour + ((startMin === "30") ? 1 : 0);
    const endMin = startMin === "00" ? "30" : "00";

    // Format for 12-hour display
    const formatTime = (hour: number, min: string) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${min} ${period}`;
    };

    return `${formatTime(startHour, startMin)} to ${formatTime(endHour, endMin)}`;
  };

  // Filter inventory items based on search term
  const filteredInventoryItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Main Schedule Card */}
      <Card className="bg-white/90 backdrop-blur-sm mb-8">
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
              appointments={doctorAppointments}
              hideAppointmentLegend={true}
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
                <div className="grid grid-cols-3 gap-3">
                  {/* Time slots rendering code */}
                  {Array.from({ length: 10 }).map((_, index) => {
                    // IMPORTANT: Start from TS001, TS002, etc. to match the API
                    const slotNumber = index + 1
                    const tsId = `TS${String(slotNumber).padStart(3, '0')}`

                    // Adjust time calculation to match your database slots
                    const startHour = 8 + Math.floor(index / 2)
                    const startMin = index % 2 === 0 ? "00" : "30"
                    const endHour = startHour + (startMin === "30" ? 1 : 0)
                    const endMin = startMin === "00" ? "30" : "00"

                    // Format for 12-hour display
                    const formatTime = (hour: number, min: string) => {
                      const period = hour >= 12 ? 'PM' : 'AM'
                      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                      return `${displayHour}:${min} ${period}`
                    }

                    const isAvailable = availableSlots.includes(tsId)

                    const handleSlotClick = () => {
                      if (isAvailable) {
                        setSelectedSlot(tsId)
                        setConfirmDialogOpen(true)
                      }
                    }

                    return (
                      <div
                        key={tsId}
                        className={`p-3 rounded-lg ${isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500'
                          } text-white text-sm transition-colors cursor-pointer`}
                        title={`Time Slot: ${tsId}`}
                        onClick={handleSlotClick}
                      >
                        <div className="font-medium">
                          {formatTime(startHour, startMin)}
                        </div>
                        <div className="text-xs opacity-90">
                          to {formatTime(endHour, endMin)}
                        </div>
                        {/* Removed the time slot ID display from here */}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Card - Upcoming and Past Appointments */}
      <Card className="bg-white/90 backdrop-blur-sm mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upcoming Appointments Section */}
          <div className="mb-6">
            <h3 className="font-medium mb-4">
              Upcoming Appointments
            </h3>

            {loadingAppointments ? (
              <div className="flex items-center justify-center p-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent"></div>
                <span className="ml-2 text-sm text-gray-500">Loading appointments...</span>
              </div>
            ) : doctorAppointments && doctorAppointments.length > 0 ? (
              <div className="space-y-4">
                {doctorAppointments.map((appointment, index) => {
                  const appointmentDate = new Date(appointment.date);
                  // Format date for display
                  const formattedDate = new Intl.DateTimeFormat('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }).format(appointmentDate);

                  // Format time for display - handle both startTime and starttime formats
                  const startTime = appointment.starttime || '';
                  const endTime = appointment.endtime || '';

                  interface FormatTimeFn {
                    (timeString: string | undefined): string;
                  }

                  const formatTime: FormatTimeFn = (timeString) => {
                    if (!timeString) return '';
                    // Convert 24h format to 12h format
                    const [hours, minutes] = timeString.split(':');
                    const hour = parseInt(hours, 10);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    return `${hour12}:${minutes} ${ampm}`;
                  };

                  const isToday = new Date().toDateString() === appointmentDate.toDateString();
                  const isPast = appointmentDate < new Date();

                  return (
                    <div
                      key={`${appointment.patient_name}-${appointment.date}-${startTime}`}
                      className={`p-4 rounded-lg border ${isToday
                        ? 'border-blue-500 bg-blue-50'
                        : isPast
                          ? 'border-gray-200 bg-gray-50 opacity-75'
                          : 'border-green-200 bg-green-50'
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{appointment.patient_name}</h3>
                          <p className="text-sm text-gray-500">
                            {formatTime(startTime)} - {formatTime(endTime)}
                          </p>
                          <p className="text-sm text-gray-500">{formattedDate}</p>
                        </div>
                        {isToday && (
                          <Badge className="bg-blue-500">Today</Badge>
                        )}
                        {!isToday && !isPast && (
                          <Badge className="bg-green-500">Upcoming</Badge>
                        )}
                        {isPast && (
                          <Badge variant="outline" className="text-gray-500">Past</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming appointments found.
              </div>
            )}
          </div>

          {/* Past Appointments Section */}
          <div>
            <h3 className="font-medium mb-4">
              Past Appointments
            </h3>

            {loadingAppointments ? (
              <div className="flex items-center justify-center p-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent"></div>
                <span className="ml-2 text-sm text-gray-500">Loading appointments...</span>
              </div>
            ) : pastAppointments && pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.map((appointment, index) => {
                  const appointmentDate = new Date(appointment.date);
                  // Format date for display
                  const formattedDate = new Intl.DateTimeFormat('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }).format(appointmentDate);

                  // Format time for display - handle both startTime and starttime formats
                  const startTime = appointment.starttime || '';
                  const endTime = appointment.endtime || '';

                  interface FormatTimeFn {
                    (timeString: string | undefined): string;
                  }

                  const formatTime: FormatTimeFn = (timeString) => {
                    if (!timeString) return '';
                    // Convert 24h format to 12h format
                    const [hours, minutes] = timeString.split(':');
                    const hour = parseInt(hours, 10);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const hour12 = hour % 12 || 12;
                    return `${hour12}:${minutes} ${ampm}`;
                  };

                  return (
                    <div
                      key={`${appointment.patient_name}-${appointment.date}-${startTime}-past`}
                      className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{appointment.patient_name}</h3>
                          <p className="text-sm text-gray-500">
                            {formatTime(startTime)} - {formatTime(endTime)}
                          </p>
                          <p className="text-sm text-gray-500">{formattedDate}</p>
                        </div>
                        <Badge variant="outline" className="text-gray-500">Past</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No past appointments found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hospital Inventory Card */}
      <Card className="bg-white/90 backdrop-blur-sm" ref={inventoryRef}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Hospital Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex items-center mb-6 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search inventory items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInventoryItems}
                disabled={loadingInventory}
              >
                Refresh
              </Button>
            </div>

            {inventoryError && (
              <Alert variant="destructive" className="mb-4 flex items-center">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2 flex-1">{inventoryError}</AlertDescription>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchInventoryItems}
                  className="ml-auto text-xs"
                >
                  Retry
                </Button>
              </Alert>
            )}

            {loadingInventory ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
                <p className="mt-2">Loading inventory...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-cyan-600 text-white">
                    <tr>
                      {/* Removed the ID column */}
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Format</th>
                      <th className="p-3 text-left">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventoryItems.length > 0 ? (
                      filteredInventoryItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                          {/* Removed the ID column */}
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3">{item.format}</td>
                          <td className="p-3">
                            <Badge variant={
                              parseInt(item.amount) > 20
                                ? 'success'
                                : parseInt(item.amount) > 5
                                  ? 'warning'
                                  : 'destructive'
                            }>
                              {item.amount}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-10 text-gray-500">
                          {searchTerm
                            ? "No inventory items match your search."
                            : "No inventory items available."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Unavailability Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Unavailable</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this time slot as unavailable?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-gray-50 rounded-md p-3 mb-4">
              <p><strong>Date:</strong> {formatDisplayDate(selectedDate)}</p>
              {selectedSlot && (
                <p><strong>Time Slot:</strong> {getTimeIntervalForSlot(selectedSlot)}</p>
              )}
            </div>

            {declareError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {declareError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={declareLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={declareUnavailability}
              disabled={declareLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {declareLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                'Mark as Unavailable'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Notification */}
      {declareSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg flex items-center max-w-md">
          <span>{declareSuccess}</span>
          <button
            onClick={() => setDeclareSuccess("")}
            className="ml-4 text-white hover:text-green-200"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

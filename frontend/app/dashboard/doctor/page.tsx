"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Package, Search, AlertCircle } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false)
  
  // Inventory state
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [loadingInventory, setLoadingInventory] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [inventoryError, setInventoryError] = useState<string>("")
  
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
        setDoctorAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
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
                  {/* Time slots rendering code */}
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

      {/* Inventory Card */}
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
    </div>
  );
}

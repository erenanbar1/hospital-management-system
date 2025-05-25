"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, FileText, Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TestTube, Package, Plus } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { logout } from '@/utils/auth'

export default function StaffDashboard() {
  const { userName } = useUser()
  
  // Form state for blood test creation
  const [formData, setFormData] = useState({
    patientId: "",
    hemoglobin: "",
    glucose: "",
    cholesterol: "",
    wbc: "",
    rbc: "",
    vitamins: "",
    minerals: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  
  // Equipment inventory state
  const [equipment, setEquipment] = useState([])
  const [equipmentLoading, setEquipmentLoading] = useState(false)


  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Fetch equipment data
  const fetchEquipment = async () => {
    setEquipmentLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/api/equipment/')
      const data = await response.json()

      if (data.success) {
        setEquipment(data.equipment)
      } else {
        setEquipment([])
      }
    } catch (err) {
      setEquipment([])
    } finally {
      setEquipmentLoading(false)
    }
  }

  // Load equipment on component mount
  useEffect(() => {
    fetchEquipment()
  }, [])

  // Get status based on amount
  const getEquipmentStatus = (amount: string) => {
    const qty = parseInt(amount)
    if (qty === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (qty < 10) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    if (qty < 50) return { text: "Available", color: "bg-green-100 text-green-800" }
    return { text: "In Stock", color: "bg-blue-100 text-blue-800" }
  }

  // Handle form submission
  const handleSaveTestResults = async () => {
    // Clear previous messages
    setError("")
    setSuccessMessage("")

    // Validate required fields
    if (!formData.patientId || !formData.hemoglobin || !formData.glucose || !formData.cholesterol || !formData.wbc || !formData.rbc) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/create_blood_test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_id: formData.patientId,
          vitamins: formData.vitamins || "Not specified",
          minerals: formData.minerals || "Not specified", 
          cholesterol: formData.cholesterol,
          glucose: formData.glucose,
          hemoglobin: formData.hemoglobin,
          whiteBC: formData.wbc,
          redBC: formData.rbc
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage("Blood test results saved successfully!")
        // Clear the form
        setFormData({
          patientId: "",
          hemoglobin: "",
          glucose: "",
          cholesterol: "",
          wbc: "",
          rbc: "",
          vitamins: "",
          minerals: ""
        })
      } else {
        setError(data.message || "Failed to save test results")
      }
    } catch (err) {
      setError("Error saving test results: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }





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
            <Link href="/dashboard/staff" className="text-cyan-200 font-semibold">
              Dashboard
            </Link>
            <Link href="/dashboard/staff/tests" className="hover:text-cyan-200">
              Test Results
            </Link>
            <Link href="/dashboard/staff/equipment" className="hover:text-cyan-200">
              Equipment
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{userName || 'Loading...'}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:text-cyan-200 hover:bg-cyan-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">


        {/* Enter Test Results */}
        <Card className="bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Enter Blood Test Results
            </CardTitle>
            <CardDescription>Input patient test results and lab values</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Success/Error Messages */}
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
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patientId">Patient ID *</Label>
                  <Input 
                    id="patientId" 
                    placeholder="Enter patient ID (e.g., U0001)" 
                    value={formData.patientId}
                    onChange={(e) => handleInputChange("patientId", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="hemoglobin">Hemoglobin (g/dL) *</Label>
                  <Input 
                    id="hemoglobin" 
                    type="number" 
                    placeholder="13.5" 
                    value={formData.hemoglobin}
                    onChange={(e) => handleInputChange("hemoglobin", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="glucose">Glucose (mg/dL) *</Label>
                  <Input 
                    id="glucose" 
                    type="number" 
                    placeholder="90" 
                    value={formData.glucose}
                    onChange={(e) => handleInputChange("glucose", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="minerals">Minerals</Label>
                  <Input 
                    id="minerals" 
                    placeholder="Na: 2, P: 2" 
                    value={formData.minerals}
                    onChange={(e) => handleInputChange("minerals", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cholesterol">Cholesterol (mg/dL) *</Label>
                  <Input 
                    id="cholesterol" 
                    type="number" 
                    placeholder="180" 
                    value={formData.cholesterol}
                    onChange={(e) => handleInputChange("cholesterol", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="wbc">White Blood Cells (×10³/μL) *</Label>
                  <Input 
                    id="wbc" 
                    type="number" 
                    placeholder="6.5" 
                    value={formData.wbc}
                    onChange={(e) => handleInputChange("wbc", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rbc">Red Blood Cells (×10⁶/μL) *</Label>
                  <Input 
                    id="rbc" 
                    type="number" 
                    placeholder="4.7" 
                    value={formData.rbc}
                    onChange={(e) => handleInputChange("rbc", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vitamins">Vitamins</Label>
                  <Input 
                    id="vitamins" 
                    placeholder="Vitamin A: 50mcg, Vitamin C: 20mg" 
                    value={formData.vitamins}
                    onChange={(e) => handleInputChange("vitamins", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                className="bg-green-500 hover:bg-green-600"
                onClick={handleSaveTestResults}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Test Results"}
              </Button>
              <p className="text-sm text-gray-500 mt-2">* Required fields</p>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Inventory Summary */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Equipment Inventory
            </CardTitle>
            <CardDescription>Current medical equipment stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            {equipmentLoading ? (
              <div className="text-center py-8">
                <p>Loading equipment...</p>
              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No equipment found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipment.slice(0, 5).map((item: any) => {
                        const status = getEquipmentStatus(item.amount)
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.format}</TableCell>
                            <TableCell className="font-semibold">{item.amount}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                                {status.text}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {equipment.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link href="/dashboard/staff/equipment">
                      <Button variant="outline" className="w-full">
                        View All Equipment ({equipment.length} items)
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Equipment Summary Stats */}
                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-xl font-bold">{equipment.length}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-sm font-medium text-gray-600">In Stock</p>
                    <p className="text-xl font-bold text-green-600">
                      {equipment.filter((item: any) => parseInt(item.amount) > 0).length}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {equipment.filter((item: any) => {
                        const qty = parseInt(item.amount)
                        return qty > 0 && qty < 10
                      }).length}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                    <p className="text-xl font-bold text-red-600">
                      {equipment.filter((item: any) => parseInt(item.amount) === 0).length}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

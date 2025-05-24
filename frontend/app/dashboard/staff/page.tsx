"use client"

import Link from "next/link"
import { Heart, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TestTube, Package, Plus } from "lucide-react"

export default function StaffDashboard() {
  const recentTests = [
    { id: "BT001", patient: "John Doe", type: "Blood Test", date: "2025-03-28", status: "Completed" },
    { id: "BT002", patient: "Jane Smith", type: "Blood Test", date: "2025-03-28", status: "Pending" },
    { id: "BT003", patient: "Bob Johnson", type: "Blood Test", date: "2025-03-27", status: "Completed" },
    { id: "BT004", patient: "Alice Brown", type: "Blood Test", date: "2025-03-27", status: "In Progress" },
  ]

  const equipment = [
    { id: "EQ001", name: "Blood Analyzer", quantity: 5, status: "Available" },
    { id: "EQ002", name: "Test Tubes", quantity: 150, status: "Available" },
    { id: "EQ003", name: "Centrifuge", quantity: 2, status: "In Use" },
    { id: "EQ004", name: "Microscope", quantity: 8, status: "Available" },
  ]

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
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>Staff Member</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <TestTube className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Equipment Available</p>
                  <p className="text-2xl font-bold">165</p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tests Today</p>
                  <p className="text-2xl font-bold">28</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

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
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input id="patientId" placeholder="Enter patient ID" />
                </div>
                <div>
                  <Label htmlFor="testType">Test Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood">Blood Test</SelectItem>
                      <SelectItem value="urine">Urine Test</SelectItem>
                      <SelectItem value="xray">X-Ray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                  <Input id="hemoglobin" type="number" placeholder="13.5" />
                </div>
                <div>
                  <Label htmlFor="glucose">Glucose (mg/dL)</Label>
                  <Input id="glucose" type="number" placeholder="90" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cholesterol">Cholesterol (mg/dL)</Label>
                  <Input id="cholesterol" type="number" placeholder="180" />
                </div>
                <div>
                  <Label htmlFor="wbc">White Blood Cells (×10³/μL)</Label>
                  <Input id="wbc" type="number" placeholder="6.5" />
                </div>
                <div>
                  <Label htmlFor="rbc">Red Blood Cells (×10⁶/μL)</Label>
                  <Input id="rbc" type="number" placeholder="4.7" />
                </div>
                <div>
                  <Label htmlFor="vitamins">Vitamins</Label>
                  <Input id="vitamins" placeholder="Vitamin A: 50mcg, Vitamin C: 20mg" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Save Test Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tests */}
        <Card className="bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
            <CardDescription>Recently entered test results</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.id}</TableCell>
                    <TableCell>{test.patient}</TableCell>
                    <TableCell>{test.type}</TableCell>
                    <TableCell>{test.date}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          test.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : test.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {test.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Equipment Management */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Medical Equipment
            </CardTitle>
            <CardDescription>Current equipment inventory and status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "Available" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

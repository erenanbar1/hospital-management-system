"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Heart, User, FileText, ChevronDown } from "lucide-react"

export default function HealthCard() {
  const bloodTestResults = [
    { name: "Vitamin A", value: "43 mcg/dL" },
    { name: "Vitamin B", value: "xx mcg/dL" },
    { name: "Vitamin C", value: "xx mcg/dL" },
    { name: "Iron", value: "xx mcg/dL" },
  ]

  const prescriptions = [
    { name: "Arveles", format: "Pill", dosage: "50mg" },
    { name: "Bilaxten", format: "Pill", dosage: "25mg" },
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
            <Link href="/dashboard/patient" className="hover:text-cyan-200">
              Home
            </Link>
            <Link href="/dashboard/patient/appointments" className="hover:text-cyan-200">
              My Appointments
            </Link>
            <Link href="/dashboard/patient/health-card" className="text-cyan-200 font-semibold">
              Health Card
            </Link>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>John Doe</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Health Card
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Information */}
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Patient Information:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span> Lorem
                </div>
                <div>
                  <span className="text-gray-600">Surname:</span> Ipsum
                </div>
                <div>
                  <span className="text-gray-600">Email:</span> loremipsum@gmail.com
                </div>
                <div>
                  <span className="text-gray-600">Phone no:</span> 56565656
                </div>
              </div>
            </div>

            {/* Blood Test Results */}
            <Card>
              <CardHeader className="bg-cyan-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Blood Test</CardTitle>
                    <p className="text-cyan-100 text-sm">xx/xx/xxxx</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white text-cyan-600">
                      Pending
                    </Badge>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="bg-cyan-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Blood Test</CardTitle>
                    <p className="text-cyan-100 text-sm">xx/xx/xxxx</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white text-cyan-600">
                      Available
                    </Badge>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-cyan-400 text-white">
                      <TableHead className="text-white">Type</TableHead>
                      <TableHead className="text-white">Date</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bloodTestResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{result.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Prescriptions */}
            <Card>
              <CardHeader className="bg-cyan-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Prescription</CardTitle>
                    <p className="text-cyan-100 text-sm">xx/xx/xxxx</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white text-cyan-600">
                      Available
                    </Badge>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-0">
                  <div>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-cyan-400 text-white">
                          <TableHead className="text-white">Name</TableHead>
                          <TableHead className="text-white">Format</TableHead>
                          <TableHead className="text-white">Dosage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescriptions.map((prescription, index) => (
                          <TableRow key={index}>
                            <TableCell>{prescription.name}</TableCell>
                            <TableCell>{prescription.format}</TableCell>
                            <TableCell>{prescription.dosage}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="bg-gray-50 p-4">
                    <h4 className="font-semibold mb-2">Usage Info</h4>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                      in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

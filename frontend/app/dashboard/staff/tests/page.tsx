"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, User, Search, TestTube, Edit, Save, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUser } from "@/hooks/use-user"
import { logout } from '@/utils/auth'

interface BloodTest {
  bt_id: string
  vitamins: string
  minerals: string
  cholesterol: string
  glucose: string
  hemoglobin: string
  white_blood_cells: string
  red_blood_cells: string
  test_date: string
  patient_name: string
  patient_surname: string
}

export default function StaffTestsPage() {
  const { userName } = useUser()
  const [searchPatientId, setSearchPatientId] = useState("")
  const [bloodTests, setBloodTests] = useState<BloodTest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [editingTest, setEditingTest] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<BloodTest>>({})

  const searchPatientTests = async (patientId?: string) => {
    const idToSearch = patientId || searchPatientId
    if (!idToSearch.trim()) {
      setError("Please enter a patient ID")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      const response = await fetch(`http://localhost:8000/api/get_patient_blood_tests/${idToSearch}/`)
      const data = await response.json()

      if (data.success) {
        setBloodTests(data.blood_tests)
        if (data.blood_tests.length === 0) {
          setError("No blood tests found for this patient")
        }
      } else {
        setError(data.message || "Failed to fetch blood tests")
        setBloodTests([])
      }
    } catch (err) {
      setError("Error fetching blood tests: " + (err instanceof Error ? err.message : "Unknown error"))
      setBloodTests([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-search when patient ID changes (with debounce)
  useEffect(() => {
    if (searchPatientId.trim()) {
      const timeoutId = setTimeout(() => {
        searchPatientTests(searchPatientId)
      }, 500) // 500ms delay to avoid too many API calls

      return () => clearTimeout(timeoutId)
    } else {
      // Clear results when input is empty
      setBloodTests([])
      setError("")
    }
  }, [searchPatientId])

  const startEditing = (test: BloodTest) => {
    setEditingTest(test.bt_id)
    setEditForm({
      vitamins: test.vitamins,
      minerals: test.minerals,
      cholesterol: test.cholesterol,
      glucose: test.glucose,
      hemoglobin: test.hemoglobin,
      white_blood_cells: test.white_blood_cells,
      red_blood_cells: test.red_blood_cells
    })
  }

  const cancelEditing = () => {
    setEditingTest(null)
    setEditForm({})
  }

  const saveTestResults = async (btId: string) => {
    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const response = await fetch('http://localhost:8000/api/update_blood_test_results/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bt_id: btId,
          vitamins: editForm.vitamins,
          minerals: editForm.minerals,
          cholesterol: editForm.cholesterol,
          glucose: editForm.glucose,
          hemoglobin: editForm.hemoglobin,
          whiteBC: editForm.white_blood_cells,
          redBC: editForm.red_blood_cells
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage("Test results updated successfully!")
        setEditingTest(null)
        setEditForm({})
        // Refresh the data
        searchPatientTests()
      } else {
        setError(data.message || "Failed to update test results")
      }
    } catch (err) {
      setError("Error updating test results: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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
            <Link href="/dashboard/staff" className="hover:text-cyan-200">
              Dashboard
            </Link>
            <Link href="/dashboard/staff/tests" className="text-cyan-200 font-semibold">
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
        {/* Search Section */}
        <Card className="bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Patient Blood Tests
            </CardTitle>
            <CardDescription>Enter a patient ID to view and manage their blood test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="patientSearch">Patient ID</Label>
                <Input
                  id="patientSearch"
                  value={searchPatientId}
                  onChange={(e) => setSearchPatientId(e.target.value)}
                  placeholder="Enter patient ID (e.g., U0001)"
                  onKeyPress={(e) => e.key === 'Enter' && searchPatientTests()}
                />
              </div>
              <Button 
                onClick={() => searchPatientTests()}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {loading ? "Searching..." : "Search Tests"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
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

        {/* Blood Tests Table */}
        {bloodTests.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Blood Test Results
              </CardTitle>
              <CardDescription>
                Patient: {bloodTests[0]?.patient_name} {bloodTests[0]?.patient_surname}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vitamins</TableHead>
                      <TableHead>Minerals</TableHead>
                      <TableHead>Cholesterol</TableHead>
                      <TableHead>Glucose</TableHead>
                      <TableHead>Hemoglobin</TableHead>
                      <TableHead>WBC</TableHead>
                      <TableHead>RBC</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bloodTests.map((test) => (
                      <TableRow key={test.bt_id}>
                        <TableCell className="font-medium">{test.bt_id}</TableCell>
                        <TableCell>{formatDate(test.test_date)}</TableCell>
                        <TableCell>
                          {editingTest === test.bt_id ? (
                            <Input
                              value={editForm.vitamins || ''}
                              onChange={(e) => setEditForm({...editForm, vitamins: e.target.value})}
                              className="w-32"
                            />
                          ) : (
                            test.vitamins
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTest === test.bt_id ? (
                            <Input
                              value={editForm.minerals || ''}
                              onChange={(e) => setEditForm({...editForm, minerals: e.target.value})}
                              className="w-32"
                            />
                          ) : (
                            test.minerals
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTest === test.bt_id ? (
                            <Input
                              value={editForm.cholesterol || ''}
                              onChange={(e) => setEditForm({...editForm, cholesterol: e.target.value})}
                              className="w-24"
                            />
                          ) : (
                            test.cholesterol
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTest === test.bt_id ? (
                            <Input
                              value={editForm.glucose || ''}
                              onChange={(e) => setEditForm({...editForm, glucose: e.target.value})}
                              className="w-24"
                            />
                          ) : (
                            test.glucose
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTest === test.bt_id ? (
                            <Input
                              value={editForm.hemoglobin || ''}
                              onChange={(e) => setEditForm({...editForm, hemoglobin: e.target.value})}
                              className="w-24"
                            />
                          ) : (
                            test.hemoglobin
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTest === test.bt_id ? (
                            <Input
                              value={editForm.white_blood_cells || ''}
                              onChange={(e) => setEditForm({...editForm, white_blood_cells: e.target.value})}
                              className="w-24"
                            />
                          ) : (
                            test.white_blood_cells
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTest === test.bt_id ? (
                            <Input
                              value={editForm.red_blood_cells || ''}
                              onChange={(e) => setEditForm({...editForm, red_blood_cells: e.target.value})}
                              className="w-24"
                            />
                          ) : (
                            test.red_blood_cells
                          )}
                        </TableCell>
                        <TableCell>
                          {editingTest === test.bt_id ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => saveTestResults(test.bt_id)}
                                disabled={loading}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEditing}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(test)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No results message */}
        {!loading && bloodTests.length === 0 && searchPatientId && !error && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <TestTube className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No blood tests found for patient ID: {searchPatientId}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 
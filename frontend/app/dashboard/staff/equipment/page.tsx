"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, User, Package, Edit, Save, X, Plus, Minus, Search, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUser } from "@/hooks/use-user"

interface Equipment {
  id: string
  name: string
  format: string
  amount: string
}

export default function StaffEquipmentPage() {
  const { userName } = useUser()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  
  // New equipment form state
  const [showNewItemForm, setShowNewItemForm] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    format: "",
    amount: ""
  })

  // Fetch equipment data
  const fetchEquipment = async () => {
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch('http://localhost:8000/api/equipment/')
      const data = await response.json()

      if (data.success) {
        setEquipment(data.equipment)
        setFilteredEquipment(data.equipment)
      } else {
        setError(data.message || "Failed to fetch equipment")
        setEquipment([])
        setFilteredEquipment([])
      }
          } catch (err) {
        setError("Error fetching equipment: " + (err instanceof Error ? err.message : "Unknown error"))
        setEquipment([])
        setFilteredEquipment([])
      } finally {
        setLoading(false)
      }
  }

  // Load equipment on component mount
  useEffect(() => {
    fetchEquipment()
  }, [])

  // Filter equipment based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEquipment(equipment)
    } else {
      const filtered = equipment.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.format.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredEquipment(filtered)
    }
  }, [searchTerm, equipment])

  // Start editing equipment
  const startEditing = (equipmentId: string, currentAmount: string) => {
    setEditingEquipment(equipmentId)
    setEditAmount(currentAmount)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingEquipment(null)
    setEditAmount("")
  }

  // Update equipment amount
  const updateEquipmentAmount = async (equipmentId: string) => {
    if (!editAmount.trim()) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const response = await fetch('http://localhost:8000/api/equipment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          equipment: equipmentId,
          amount: editAmount
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage("Equipment updated successfully!")
        setEditingEquipment(null)
        setEditAmount("")
        // Refresh equipment data
        fetchEquipment()
      } else {
        setError(data.message || "Failed to update equipment")
      }
    } catch (err) {
      setError("Error updating equipment: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  // Quick update functions
  const quickUpdate = async (equipmentId: string, currentAmount: string, change: number) => {
    const newAmount = Math.max(0, parseInt(currentAmount) + change).toString()
    
    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const response = await fetch('http://localhost:8000/api/equipment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          equipment: equipmentId,
          amount: newAmount
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(`Equipment ${change > 0 ? 'increased' : 'decreased'} successfully!`)
        // Refresh equipment data
        fetchEquipment()
      } else {
        setError(data.message || "Failed to update equipment")
      }
    } catch (err) {
      setError("Error updating equipment: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  // Create new equipment item
  const createNewEquipment = async () => {
    if (!newItem.name.trim() || !newItem.format.trim() || !newItem.amount.trim()) {
      setError("Please fill in all fields for the new equipment")
      return
    }

    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const response = await fetch('http://localhost:8000/api/create_equipment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newItem.name,
          format: newItem.format,
          amount: newItem.amount
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage("New equipment created successfully!")
        setNewItem({ name: "", format: "", amount: "" })
        setShowNewItemForm(false)
        // Refresh equipment data
        fetchEquipment()
      } else {
        setError(data.message || "Failed to create equipment")
      }
    } catch (err) {
      setError("Error creating equipment: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  // Get status based on amount
  const getStatus = (amount: string) => {
    const qty = parseInt(amount)
    if (qty === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (qty < 10) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    if (qty < 50) return { text: "Available", color: "bg-green-100 text-green-800" }
    return { text: "In Stock", color: "bg-blue-100 text-blue-800" }
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
            <Link href="/dashboard/staff/tests" className="hover:text-cyan-200">
              Test Results
            </Link>
            <Link href="/dashboard/staff/equipment" className="text-cyan-200 font-semibold">
              Equipment
            </Link>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{userName || 'Loading...'}</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Medical Equipment Management</h1>
          <p className="text-cyan-100">Manage hospital equipment inventory and stock levels</p>
        </div>

        {/* Search and Add New Equipment */}
        <Card className="bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Equipment
            </CardTitle>
            <CardDescription>Search for equipment by name, ID, or format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="equipmentSearch">Search Equipment</Label>
                <Input
                  id="equipmentSearch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter equipment name, ID, or format..."
                />
              </div>
              <Button 
                onClick={() => setShowNewItemForm(!showNewItemForm)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {showNewItemForm ? "Cancel" : "Add New Equipment"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add New Equipment Form */}
        {showNewItemForm && (
          <Card className="bg-white/90 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Add New Equipment
              </CardTitle>
              <CardDescription>Create a new equipment item in the inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="newName">Equipment Name *</Label>
                  <Input
                    id="newName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="e.g., Blood Analyzer"
                  />
                </div>
                <div>
                  <Label htmlFor="newFormat">Format *</Label>
                  <Input
                    id="newFormat"
                    value={newItem.format}
                    onChange={(e) => setNewItem({...newItem, format: e.target.value})}
                    placeholder="e.g., Piece, Box, Set"
                  />
                </div>
                <div>
                  <Label htmlFor="newAmount">Initial Amount *</Label>
                  <Input
                    id="newAmount"
                    type="number"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                    placeholder="e.g., 10"
                    min="0"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={createNewEquipment}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? "Creating..." : "Create Equipment"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowNewItemForm(false)
                    setNewItem({ name: "", format: "", amount: "" })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Equipment Inventory */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Equipment Inventory
            </CardTitle>
            <CardDescription>
              Current medical equipment stock levels and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && !editingEquipment ? (
              <div className="text-center py-8">
                <p>Loading equipment...</p>
              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No equipment found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Quick Actions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {searchTerm ? `No equipment found matching "${searchTerm}"` : "No equipment available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEquipment.map((item) => {
                      const status = getStatus(item.amount)
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.format}</TableCell>
                          <TableCell>
                            {editingEquipment === item.id ? (
                              <Input
                                type="number"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                className="w-20"
                                min="0"
                              />
                            ) : (
                              <span className="font-semibold">{item.amount}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                              {status.text}
                            </span>
                          </TableCell>
                          <TableCell>
                            {editingEquipment !== item.id && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => quickUpdate(item.id, item.amount, -1)}
                                  disabled={loading || parseInt(item.amount) <= 0}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => quickUpdate(item.id, item.amount, 1)}
                                  disabled={loading}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingEquipment === item.id ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateEquipmentAmount(item.id)}
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
                                onClick={() => startEditing(item.id, item.amount)}
                                disabled={loading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                                                  </TableRow>
                        )
                      })
                    )}
                    </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipment Summary */}
        {equipment.length > 0 && (
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold">{equipment.length}</p>
                  {searchTerm && (
                    <p className="text-xs text-gray-500">({filteredEquipment.length} shown)</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">
                    {equipment.filter(item => parseInt(item.amount) > 0).length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {equipment.filter(item => {
                      const qty = parseInt(item.amount)
                      return qty > 0 && qty < 10
                    }).length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {equipment.filter(item => parseInt(item.amount) === 0).length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select"
import {
  Heart,
  User,
  Users,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  LogOut
} from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { useToast } from "@/components/ui/use-toast"

interface SystemUser {
  u_id: string
  name: string
  surname: string
  email_address: string
  phone_no: string
  role: string
  active?: boolean
  specialization?: string
  price?: number
  d_id?: string
  balance?: number
}

interface Stats {
  total_users: number
  total_doctors: number
  total_staff: number
  total_patients: number
}

interface Department {
  d_id: string
  d_name: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { userName } = useUser()
  const { toast } = useToast()

  const [users, setUsers] = useState<SystemUser[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_doctors: 0,
    total_staff: 0,
    total_patients: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    specialization: "",
    price: "",
    department: "",
    balance: ""
  })

  const fetchData = async () => {
    setLoading(true)
    setError("")

    try {
      // Fetch users
      const usersResponse = await fetch("http://localhost:8000/api/admin/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!usersResponse.ok) {
        throw new Error(`Failed to fetch users: ${usersResponse.status}`)
      }

      const usersData = await usersResponse.json()
      if (usersData.success) {
        setUsers(usersData.users || [])
      }

      // Fetch stats
      const statsResponse = await fetch("http://localhost:8000/api/admin/stats/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch stats: ${statsResponse.status}`)
      }

      const statsData = await statsResponse.json()
      if (statsData.success) {
        setStats(
          statsData.stats || {
            total_users: 0,
            total_doctors: 0,
            total_staff: 0,
            total_patients: 0
          }
        )
      }

      // Fetch departments
      const deptsResponse = await fetch("http://localhost:8000/api/admin/departments/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!deptsResponse.ok) {
        throw new Error(`Failed to fetch departments: ${deptsResponse.status}`)
      }

      const deptsData = await deptsResponse.json()
      if (deptsData.success) {
        setDepartments(deptsData.departments || [])
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete user")
      }

      toast({
        title: "Success",
        description: "User deleted successfully"
      })

      fetchData()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete user",
        variant: "destructive"
      })
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:8000/api/admin/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create user")
      }

      toast({
        title: "Success",
        description: "User created successfully"
      })

      setShowAddDialog(false)
      setFormData({
        name: "",
        surname: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        specialization: "",
        price: "",
        department: "",
        balance: ""
      })
      fetchData()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create user",
        variant: "destructive"
      })
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser) return

    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${selectedUser.u_id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update user")
      }

      toast({
        title: "Success",
        description: "User updated successfully"
      })

      setShowEditDialog(false)
      setSelectedUser(null)
      setFormData({
        name: "",
        surname: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        specialization: "",
        price: "",
        department: "",
        balance: ""
      })
      fetchData()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update user",
        variant: "destructive"
      })
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-300 to-cyan-500">
      {/* Header */}
      <header className="bg-cyan-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">Hastane Admin</span>
          </div>
          <nav className="flex items-center gap-6">
            <span className="text-cyan-200">Welcome, {userName || "Admin"}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogout}
              className="text-white border-white hover:bg-white hover:text-cyan-600"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.total_users}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Doctors</p>
                  <p className="text-2xl font-bold">{stats.total_doctors}</p>
                </div>
                <div className="p-3 rounded-full bg-green-500">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Staff</p>
                  <p className="text-2xl font-bold">{stats.total_staff}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-500">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Patients</p>
                  <p className="text-2xl font-bold">{stats.total_patients}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-500">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage system users and their roles</CardDescription>
              </div>
              <Button onClick={() => setShowAddDialog(true)} className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.u_id}>
                      <TableCell className="font-medium">
                        {user.name} {user.surname}
                      </TableCell>
                      <TableCell>{user.email_address}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user)
                              setFormData({
                                name: user.name,
                                surname: user.surname,
                                email: user.email_address,
                                phone: user.phone_no,
                                role: user.role,
                                specialization: user.specialization || "",
                                price: String(user.price || ""),
                                department: user.d_id || "",
                                balance: String(user.balance || ""),
                                password: ""
                              })
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.u_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user in the system. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Last Name</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === "doctor" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.d_id} value={dept.d_id}>
                            {dept.d_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {formData.role === "patient" && (
                <div className="space-y-2">
                  <Label htmlFor="balance">Initial Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Leave password blank to keep current password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">First Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-surname">Last Name</Label>
                  <Input
                    id="edit-surname"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">New Password (optional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={selectedUser?.role || ""} disabled />
                </div>

{selectedUser?.role === "doctor" && (
  <>
    <div className="space-y-2">
      <Label htmlFor="edit-specialization">Specialization</Label>
      <Input
        id="edit-specialization"
        value={formData.specialization}
        onChange={(e) =>
          setFormData({ ...formData, specialization: e.target.value })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="edit-price">Price</Label>
      <Input
        id="edit-price"
        type="number"
        value={formData.price}
        onChange={(e) =>
          setFormData({ ...formData, price: e.target.value })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="edit-department">Department</Label>
      <Select
        value={formData.department}
        onValueChange={(value) =>
          setFormData({ ...formData, department: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.d_id} value={dept.d_id}>
              {dept.d_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </>
)}

{selectedUser?.role === "patient" && (
  <div className="space-y-2">
    <Label htmlFor="edit-balance">Balance</Label>
    <Input
      id="edit-balance"
      type="number"
      value={formData.balance}
      onChange={(e) =>
        setFormData({ ...formData, balance: e.target.value })
      }
    />
  </div>
)}
</div>

<DialogFooter>
<Button type="submit">Update User</Button>
</DialogFooter>
</form>
</DialogContent>
</Dialog>
</div>
)
}


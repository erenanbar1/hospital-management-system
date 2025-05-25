"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Heart, Users, Stethoscope, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    phone: ""
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store user data in localStorage
      localStorage.setItem("userId", data.u_id)
      localStorage.setItem("userType", data.role)

      // Redirect based on user role
      switch (data.role.toLowerCase()) {
        case 'patient':
          router.push('/dashboard/patient')
          break
        case 'doctor':
          router.push('/dashboard/doctor')
          break
        case 'staff':
          router.push('/dashboard/staff')
          break
        case 'admin':
          router.push('/dashboard/admin')
          break
        default:
          throw new Error("Unknown user role")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // After successful registration, switch to login
      setIsLogin(true)
      setFormData({
        email: formData.email,
        password: "",
        name: "",
        surname: "",
        phone: ""
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-300 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Form */}
        <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-cyan-600" />
              <h1 className="text-2xl font-bold text-cyan-800">Hastane</h1>
            </div>
            <CardTitle className="text-xl">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>{isLogin ? "Sign in to your account" : "Join our healthcare platform"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <Tabs value={isLogin ? "login" : "register"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    Sign In
                  </Button>
                  <Button variant="link" className="w-full text-sm text-cyan-600">
                    Forgot Password?
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">First Name</Label>
                      <Input
                        id="name"
                        placeholder="First name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surname">Last Name</Label>
                      <Input
                        id="surname"
                        placeholder="Last name"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right Side - Hero Image and Info */}
        <div className="hidden lg:block">
          <div className="text-center text-white mb-8">
            <h2 className="text-4xl font-bold mb-4">Your doctor, just one click away!</h2>
            <p className="text-lg opacity-90">Want to find your nearest Doctor?</p>
          </div>

          <div className="relative mb-8">
            <div className="w-96 h-64 bg-white/20 rounded-lg mx-auto flex items-center justify-center">
              <Stethoscope className="h-32 w-32 text-white/60" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-white">
            <div className="space-y-2">
              <Users className="h-12 w-12 mx-auto opacity-80" />
              <h3 className="font-semibold">Patient Care</h3>
              <p className="text-sm opacity-75">Comprehensive healthcare services</p>
            </div>
            <div className="space-y-2">
              <Stethoscope className="h-12 w-12 mx-auto opacity-80" />
              <h3 className="font-semibold">Medical Excellence</h3>
              <p className="text-sm opacity-75">Expert medical professionals</p>
            </div>
            <div className="space-y-2">
              <Shield className="h-12 w-12 mx-auto opacity-80" />
              <h3 className="font-semibold">Healthcare Services</h3>
              <p className="text-sm opacity-75">Secure and reliable platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

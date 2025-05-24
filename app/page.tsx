"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Users, Stethoscope, Shield } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState("patient")

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
            <Tabs value={isLogin ? "login" : "register"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
                <Link href="/dashboard/patient">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Sign In</Button>
                </Link>
                <Button variant="link" className="w-full text-sm text-cyan-600">
                  Forgot Password?
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="First name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input id="registerEmail" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType">Account Type</Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input id="registerPassword" type="password" placeholder="Create a password" />
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Create Account</Button>
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

"use client"

import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Heart, User, Calendar, Clock, FileText, Phone, Mail, Stethoscope } from "lucide-react"
import { useUser } from "@/hooks/use-user"

export default function PatientDashboard() {
  const { userName } = useUser()

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hero Section */}
      <Card className="mb-8 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Your doctor, just one click away!</h1>
              <p className="text-gray-600 mb-6">Want to find your nearest Doctor?</p>
              <Link href="/dashboard/patient/book-appointment">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full">
                  Book Your Appointment
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="w-96 h-64 bg-cyan-100 rounded-lg mx-auto flex items-center justify-center">
                <Stethoscope className="h-32 w-32 text-cyan-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Patient Care</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our dedicated team provides high-quality medical care with state-of-the-art facilities, compassionate
              staff, and personalized treatment options to ensure the best outcomes for our patients.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Medical Excellence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We maintain the highest standards of medical excellence. Our hospital offers world-class healthcare
              professionals, cutting-edge diagnostic technologies to provide accurate and effective care.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle>Healthcare Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We offer comprehensive healthcare services, including emergency care, specialized treatments, wellness
              programs, and preventive care, ensuring a holistic approach to patient health.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your healthcare needs efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/patient/book-appointment">
              <Button variant="outline" className="h-20 flex flex-col gap-2 w-full">
                <Calendar className="h-6 w-6" />
                <span>Book Appointment</span>
              </Button>
            </Link>
            <Link href="/dashboard/patient/appointments">
              <Button variant="outline" className="h-20 flex flex-col gap-2 w-full">
                <Clock className="h-6 w-6" />
                <span>View Schedule</span>
              </Button>
            </Link>
            <Link href="/dashboard/patient/health-card">
              <Button variant="outline" className="h-20 flex flex-col gap-2 w-full">
                <FileText className="h-6 w-6" />
                <span>Health Records</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <User className="h-6 w-6" />
              <span>Find Doctor</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-12 bg-cyan-600 text-white p-6 rounded-lg">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6" />
              <span className="text-xl font-bold">Hastane</span>
            </div>
            <p className="text-cyan-100">Providing quality healthcare services with compassion and excellence.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-cyan-100">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+90 555 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@hastane.com</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Emergency</h3>
            <p className="text-cyan-100">24/7 Emergency Services Available</p>
            <Button variant="secondary" className="mt-2">
              Emergency Contact
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

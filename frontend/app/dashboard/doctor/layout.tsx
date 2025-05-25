"use client"

import Link from "next/link"
import { Heart, User } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { logout } from '@/utils/auth'

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userName } = useUser()

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
                        <Link href="/dashboard/doctor" className="text-cyan-200 font-semibold">
                            Schedule
                        </Link>
                        <Link href="/dashboard/doctor/inventory" className="hover:text-cyan-200">
                            See Inventory
                        </Link>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            <span>{userName || 'Loading...'}</span>
                        </div>
                    </nav>
                    <button
                        onClick={logout}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {children}
        </div>
    )
} 
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function InventoryNavLink({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Only handle the scroll behavior on the doctor page
    if (pathname === '/dashboard/doctor') {
      // This dispatches a custom event that our page component will listen for
      document.dispatchEvent(new CustomEvent('scrollToInventory'))
    } else {
      // If we're not on the doctor page, navigate normally
      window.location.href = '/dashboard/doctor#inventory'
    }
  }
  
  return (
    <a href="#inventory" onClick={handleClick} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors">
      {children}
    </a>
  )
}
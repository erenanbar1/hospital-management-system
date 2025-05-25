'use client'

import { useRef, useCallback } from 'react'

export function useInventoryScroll() {
  const inventoryRef = useRef<HTMLDivElement>(null)

  const scrollToInventory = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    inventoryRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return { inventoryRef, scrollToInventory }
}
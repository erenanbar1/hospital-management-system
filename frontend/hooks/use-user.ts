"use client"

import { useState, useEffect } from 'react'

interface UserInfo {
    userId: string | null
    userType: string | null
    userName: string | null
}

export function useUser() {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        userId: null,
        userType: null,
        userName: null
    })

    useEffect(() => {
        // Get user info from localStorage
        const userId = localStorage.getItem('userId')
        const userType = localStorage.getItem('userType')
        const userName = localStorage.getItem('userName')

        setUserInfo({
            userId,
            userType,
            userName
        })
    }, [])

    return userInfo
} 
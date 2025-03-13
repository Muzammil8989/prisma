"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

interface AuthFormContainerProps {
    children: React.ReactNode
    title: string
    description: string
}

export function AuthFormContainer({ children, title, description }: AuthFormContainerProps) {
    const [mounted, setMounted] = useState(false)


    // Wait for component to mount to avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])


    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-10 mx-auto w-full max-w-md px-4 sm:px-0"
            >
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="space-y-2 text-center mb-6">
                            <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
                            <p className="text-white/70">{description}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}


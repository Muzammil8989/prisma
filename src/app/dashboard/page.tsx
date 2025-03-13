"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RootState } from "@/lib/store"
import { LogOut, User, Settings, Activity } from "lucide-react"
import { clearUser, fetchCurrentUser } from "@/lib/features/auth/authSlice"
import type { AppDispatch } from "@/lib/store"
import AnimatedBackground  from "@/components/animated-background"

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, status } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, status])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      dispatch(clearUser())
      router.push("/login")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AnimatedBackground />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="container py-10 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription className="text-white/70">Your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-500/20 p-3 rounded-full">
                      <User className="h-6 w-6 text-purple-200" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-white/70">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription className="text-white/70">Manage your preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-500/20 p-3 rounded-full">
                      <Settings className="h-6 w-6 text-indigo-200" />
                    </div>
                    <div>
                      <p className="font-medium">Profile Settings</p>
                      <p className="text-sm text-white/70">Update your profile information</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription className="text-white/70">Your recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="bg-violet-500/20 p-3 rounded-full">
                      <Activity className="h-6 w-6 text-violet-200" />
                    </div>
                    <div>
                      <p className="font-medium">Recent Logins</p>
                      <p className="text-sm text-white/70">Last login: Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


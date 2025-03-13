"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { FaGoogle, FaGithub } from "react-icons/fa"
import { MdMailOutline } from "react-icons/md"
import { RiLockPasswordLine } from "react-icons/ri"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { setUser } from "@/lib/features/auth/authSlice"
import AnimatedBackground from "@/components/animated-background"
import { AuthFormContainer } from "@/components/auth-form-container"
import { InteractiveInput } from "@/components/interactive-input"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
})

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
    const dispatch = useDispatch()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Login failed")
            }

            // Set user in Redux store
            dispatch(
                setUser({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                }),
            )

            // Show success animation before redirecting
            setShowSuccessAnimation(true)

            // Redirect after animation
            setTimeout(() => {
                router.push(callbackUrl)
            }, 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid email or password")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = (provider: string) => {
        setIsLoading(true)
        window.location.href = `/api/auth/${provider}`
    }

    return (
        <>
            <AnimatedBackground />

            <AuthFormContainer title="Welcome Back" description="Enter your credentials to access your account">
                <div className="space-y-6">
                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                        <Button
                            type="button"
                            onClick={() => handleSocialLogin("google")}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white p-3 rounded-md transition-all duration-300 disabled:opacity-50"
                        >
                            <FaGoogle className="w-5 h-5" />
                            <span>Continue with Google</span>
                        </Button>

                        <Button
                            type="button"
                            onClick={() => handleSocialLogin("github")}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white p-3 rounded-md transition-all duration-300 disabled:opacity-50"
                        >
                            <FaGithub className="w-5 h-5" />
                            <span>Continue with GitHub</span>
                        </Button>
                    </div>


                    {/* Divider */}
                    <div className="relative">

                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-white/70 text-sm">
                                OR CONTINUE WITH EMAIL
                            </span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <Alert
                                            variant="destructive"
                                            className="bg-red-500/20 text-white border-red-500/50"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InteractiveInput
                                                    label="Email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    startIcon={<MdMailOutline className="w-5 h-5" />}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-300" />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InteractiveInput
                                                    label="Password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="********"
                                                    startIcon={<RiLockPasswordLine className="w-5 h-5" />}
                                                    endIcon={
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="hover:text-white transition-colors"
                                                        >
                                                            {showPassword ? (
                                                                <FaEyeSlash className="w-5 h-5" />
                                                            ) : (
                                                                <FaEye className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-300" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <AnimatePresence mode="wait">
                                    {showSuccessAnimation ? (
                                        <motion.div
                                            key="success"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="flex items-center justify-center"
                                        >
                                            <div className="bg-green-500/20 text-white rounded-md py-2 px-4 flex items-center">
                                                <svg
                                                    className="w-5 h-5 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                Login successful!
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="button"
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full py-3 px-6 text-lg font-medium backdrop-blur-md bg-gradient-to-r from-purple-600 to-indigo-600 border border-white/20 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 relative overflow-hidden group shadow-lg"
                                                disabled={isLoading}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Please wait...
                                                    </>
                                                ) : (
                                                    "Login"
                                                )}
                                            </Button>

                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Register Link */}
                <div className="mt-6 text-center text-sm text-white/70">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-white hover:text-purple-200 underline transition-colors hover:no-underline"
                    >
                        Register
                    </Link>
                </div>
            </AuthFormContainer >
        </>
    )
}
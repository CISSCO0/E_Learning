import type React from "react"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Authentication | GIU ",
  description: "Sign in or create your account to access GIU Student Courses Management System ",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2" style={{ marginTop: '-3rem' }}>
                <div className="w-10 h-10 bg-gradient-to-r from-red-700 to-red-800 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-neutral-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent pt-8 mt-0">
                  GIU 
                </h1>
              </div>
              <div className="space-y-0" style={{ marginTop: '-1rem' }}>
                <h2 className="text-4xl font-bold text-neutral-900 leading-tight">Transform Your Learning Journey</h2>
                <p className="text-xl text-neutral-600 leading-relaxed">
                  Join the GIU community where excellence in education meets innovation.
                </p> 
              </div>
            </div>

            {/* Animated illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-neutral-900 rounded-3xl opacity-10 animate-pulse"></div>
              <img
                src="/giu.jpg"
                alt="GIU Campus"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>

        {/* Right side - Auth form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-neutral-100 p-8 animate-in slide-in-from-right-5 duration-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

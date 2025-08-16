import AuthForm from '../authForm'
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-neutral-900">Create your account</h2>
        <p className="text-neutral-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-red-600 hover:text-red-700 transition-colors duration-200 hover:underline"
          >
            Sign in instead
          </Link>
        </p>
      </div>

      <AuthForm isLogin={false} />

      <div className="text-center">
        <p className="text-sm text-neutral-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-red-600 hover:text-red-700 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-red-600 hover:text-red-700 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

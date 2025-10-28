import React from 'react'
import LoginButton from '@/components/auth/LoginButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-gray-900  dark:text-white">
      {/* Card container */}
      <div className=" backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[90%] max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Sign in below to continue with your GitHub account
        </p>

        {/* GitHub login button */}
        <LoginButton />

        <p className="text-xs text-gray-400 mt-10">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
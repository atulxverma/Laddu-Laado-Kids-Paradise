import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black italic text-lg">L</span>
          </div>
          <h1 className="text-2xl font-bold text-black">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your laddoo Laado account</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-gray-100 rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors",
              formFieldInput:
                "border border-gray-200 rounded-xl focus:border-black transition-colors",
              formButtonPrimary:
                "bg-black hover:opacity-80 transition-opacity rounded-full",
              footerActionLink: "text-black font-bold",
            },
          }}
        />
      </div>
    </main>
  )
}
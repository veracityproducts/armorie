import Image from "next/image";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Faded background image - desaturated and dimmed for pre-dawn feel */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.webp"
          alt=""
          fill
          className="object-cover"
          style={{
            filter: "saturate(0.3) brightness(0.6)",
          }}
          priority
        />
        {/* Soft overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/40 via-primary-900/20 to-primary-950/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2 drop-shadow-lg">
            Create your account
          </h1>
          <p className="text-primary-100/80">
            Start your Bible study journey with Armorie
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

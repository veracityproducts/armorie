import Image from "next/image";
import { LoginForm } from "./login-form";

export default function LoginPage() {
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
            Welcome to Armorie
          </h1>
          <p className="text-primary-100/80">
            Your personal Bible verse study companion
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

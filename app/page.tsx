"use client";

import * as Fingerprint from "@fingerprint/agent";
import { useState, useEffect } from "react";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [fpAgent, setFpAgent] = useState<ReturnType<
    typeof Fingerprint.start
  > | null>(null);
  const [copied, setCopied] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEventId, setPendingEventId] = useState("");
  const [pendingSealedResult, setPendingSealedResult] = useState<string | null>(
    null,
  );
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (env.fpPublicKey) {
    }
    const fp = Fingerprint.start({
      apiKey: env.fpPublicKey,
      endpoints: "https://metrics.aionestopllc.com",
      // cache: {
      //   storage: "sessionStorage",
      //   duration: "optimize-cost",
      // },
    });
    setFpAgent(fp);
  }, []);

  const getFP = async (): Promise<{
    eventId: string;
    sealedResult: string | null;
  }> => {
    if (!fpAgent) return { eventId: "", sealedResult: null };
    try {
      const result = await fpAgent.get();
      const id = result.event_id || "";
      if (!id) throw new Error("Event ID invalid");
      // const sealedResult = result.sealed_result.base64() || null;

      console.log("Event ID: ", id);
      console.log("Visitor ID: ", result.visitor_id);
      return {
        eventId: id,
        sealedResult: result.sealed_result?.base64() ?? null,
      };
    } catch (e) {
      console.error("Fingerprint error:", e);
      return { eventId: "", sealedResult: null };
    }
  };

  const handleLogin = async () => {
    setResult(null);
    if (!email.trim() || !password) {
      setResult({
        type: "error",
        message: "Please enter your email and password.",
      });
      return;
    }

    const { eventId: currentEventId, sealedResult: currentSealedResult } =
      await getFP();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          eventId: currentEventId,
          sealedResult: currentSealedResult,
        }),
      });

      const data = await res.json();

      if (data.otpRequired) {
        setPendingEventId(currentEventId);
        setPendingSealedResult(currentSealedResult);
        setOtpRequired(true);

        return;
      }

      if (!data.success) {
        setResult({
          type: "error",
          message: data.error || "Login failed.",
        });
        return;
      }

      setResult({ type: "success", message: "Logged in successfully." });
      setTimeout(() => {
        router.push("/home");
        router.refresh();
      }, 800);
    } catch (err) {
      console.error("Login request failed:", err);
      setResult({ type: "error", message: "Something went wrong. Try again." });
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          eventId: pendingEventId,
          sealedResult: pendingSealedResult,
          otp,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setResult({ type: "error", message: data.error || "Invalid code." });
        setOtpRequired(false);
        return;
      }
      setOtpRequired(false);
      setResult({ type: "success", message: "Logged in successfully." });
      setTimeout(() => {
        router.push("/home");
        router.refresh();
      }, 800);
    } catch (err) {
      setResult({ type: "error", message: "Something went wrong. Try again." });
      setOtpRequired(false);
    }
  };

  const handleResetDb = async () => {
    try {
      await fetch("/api/reset-db");
      setResult({
        type: "success",
        message: "Demo database reset.",
      });
    } catch (err) {
      console.error("Failed to reset DB:", err);
      setResult({
        type: "error",
        message: "Failed to reset demo DB.",
      });
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Left Half: Tropical Graphic */}
      <div className="relative hidden w-1/2 items-center justify-center lg:flex overflow-hidden bg-gradient-to-br from-sky-400 via-teal-400 to-emerald-500">
        {/* Soft light shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-white opacity-10 blur-[120px]"></div>
          <div className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-yellow-300 opacity-20 blur-[120px]"></div>
          <div className="absolute left-[20%] top-[30%] h-[40%] w-[40%] rounded-full bg-emerald-300 opacity-15 blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center p-12">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rotate-12">
            <span className="text-4xl">🌴</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white tracking-tight drop-shadow">
            Southeast Asia Awaits
          </h2>
          <p className="max-w-md text-lg text-white/80 leading-relaxed">
            Temples, beaches, night markets, and rice terraces — all in one
            trip.
          </p>
        </div>

        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Right Half: Login Box */}
      <div className="flex w-full flex-col items-center justify-center bg-amber-50 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-10">
            <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">
              Welcome back
            </h1>

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="emailInput"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="emailInput"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-theme focus:border-theme"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="passwordInput"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-theme hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="passwordInput"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-theme focus:border-theme"
                  />
                </div>
              </div>

              {/* Result message */}
              <div
                id="resultBox"
                className={`mt-4 flex items-center justify-between gap-3 text-sm px-4 py-3 rounded-lg border ${
                  !result ? "hidden" : ""
                } ${
                  result?.type === "success"
                    ? "bg-green-50 text-green-800 border-green-100"
                    : "bg-red-50 text-red-800 border-red-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {result?.type === "success" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    )}
                  </svg>
                  <span id="resultMessage" className="font-medium">
                    {result?.message}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Submit */}
              <button
                id="loginBtn"
                type="button"
                onClick={handleLogin}
                className="w-full bg-theme hover:bg-theme-hover text-white font-bold rounded-lg py-3.5 shadow-lg shadow-theme/20 transition-all active:scale-[0.98] cursor-pointer mt-2"
              >
                Log in
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-8">
              Don&apos;t have an account yet?{" "}
              <a href="#" className="font-bold text-theme hover:underline">
                Sign up for free
              </a>
            </p>
          </div>

          {/* Reset DB link */}
          <p
            id="resetDBLink"
            onClick={handleResetDb}
            className="text-center text-xs text-gray-400 hover:text-gray-600 mt-6 cursor-pointer transition-colors"
          >
            Reset demo database
          </p>
          {/* Sub Info */}
          <p
            className="text-center text-xs text-gray-400 hover:text-gray-600 mt-6 cursor-pointer transition-colors select-none"
            onClick={() => {
              navigator.clipboard.writeText("sub_DaudvKyGwI130N");
              setCopied(true);
              setTimeout(() => setCopied(false), 500);
            }}
            title="Click to copy"
          >
            {copied ? "Copied!" : "sub_DaudvKyGwI130N"}
          </p>
          <Link
            href="/admin"
            className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-6 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>

      {/* OTP Modal */}
      {otpRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="text-3xl mb-3">🔐</div>
              <h2 className="text-gray-900 font-bold text-xl">
                Verify it's you
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                New device detected. Enter the verification code sent to your
                email.
              </p>
            </div>
            <input
              type="text"
              placeholder="Enter code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOtpSubmit()}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-mono tracking-widest text-gray-900 focus:outline-none focus:ring-2 focus:ring-theme focus:border-theme mb-4"
              maxLength={6}
              autoFocus
            />
            <button
              onClick={handleOtpSubmit}
              className="w-full bg-theme hover:bg-theme-hover text-white font-bold rounded-lg py-3 transition-all cursor-pointer"
            >
              Verify
            </button>
            <button
              onClick={() => {
                setOtpRequired(false);
                setOtp("");
              }}
              className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

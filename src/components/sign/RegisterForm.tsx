"use client";

import { useEffect, useState } from "react";
import { signup } from "@/actions/sign-up";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Loader2 } from "lucide-react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<
    "checking" | "taken" | "available" | "invalid" | null
  >(null);

  const validateUsername = (name: string) => /^[a-zA-Z0-9]{4,16}$/.test(name);
  const validatePassword = (pw: string) =>
    /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,32}$/.test(pw) &&
    /[A-Z]/.test(pw);

  useEffect(() => {
    if (!username || !validateUsername(username)) {
      setUsernameAvailable(username ? "invalid" : null);
      return;
    }

    setUsernameAvailable("checking");
    const timeout = setTimeout(async () => {
      const res = await fetch(
        `/api/check-username?username=${encodeURIComponent(username)}`
      );
      const { available } = await res.json();
      setUsernameAvailable(available ? "available" : "taken");
    }, 200);

    return () => clearTimeout(timeout);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be 8–32 characters, contain one uppercase letter, and may include special characters."
      );
      setLoading(false);
      return;
    }

    if (!validateUsername(username)) {
      setError("Username must be 4–16 characters, letters and numbers only.");
      setLoading(false);
      return;
    }

    if (usernameAvailable !== "available") {
      setError("Username is not available");
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("email", email);
    form.append("password", password);
    form.append("username", username);

    const result = await signup(form);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {username && (
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
            {usernameAvailable === "checking" && "Checking availability..."}
            {usernameAvailable === "available" && (
              <span className="text-green-500">Username is available</span>
            )}
            {usernameAvailable === "taken" && (
              <span className="text-red-500">Username is already taken</span>
            )}
            {usernameAvailable === "invalid" && (
              <span className="text-red-500">Invalid username</span>
            )}
          </p>
        )}
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin dark:text-white" /> : "Register"}
      </Button>
    </form>
  );
}

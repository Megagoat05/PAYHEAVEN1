// AdminResetPassword.tsx
import React, { useState } from "react";

const AdminResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Validation
    if (!email || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const adminPassword = prompt("Enter admin password:");
      if (!adminPassword) {
        setMessage("Admin password required");
        setIsLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/admin/reset-password", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "password": adminPassword, // ← Must match backend's `req.headers.password`
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setMessage(`Password reset successfully for ${email}`);
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage(err.message || "Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold">Admin: Reset User Password</h2>

      <input
        type="email"
        placeholder="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={isLoading}
        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isLoading}
        className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`bg-red-600 text-white px-4 py-2 rounded w-full transition-opacity duration-200 ${
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
        }`}
      >
        {isLoading ? "Resetting..." : "Reset User Password"}
      </button>

      {message && (
        <p
          className={`text-sm px-2 py-1 rounded ${
            message.includes("successfully") || message.includes("reset")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default AdminResetPassword;
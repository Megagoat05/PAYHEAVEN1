import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const ChangePassword: React.FC = () => {
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Frontend validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      setMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      // Show detailed backend error if available
      const errorMessage = err.message?.trim()
        ? err.message
        : "Failed to update password. Please try again.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold">Change Password</h2>

      <div>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isLoading}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isLoading}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`bg-blue-600 text-white px-4 py-2 rounded w-full transition-opacity duration-200 ${
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
        }`}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>

      {message && (
        <p
          className={`text-sm px-2 py-1 rounded ${
            message.includes("successfully")
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

export default ChangePassword;
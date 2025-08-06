import { useEffect, useState } from "react";
import AdminResetPassword from "../components/AdminResetPassword";
import { useRouter } from "next/router";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Optional: Redirect non-admins
  useEffect(() => {
    const isAdminSession = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminSession);
  }, []);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
    } else {
      alert("Invalid admin password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    setPassword("");
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow max-w-md w-full">
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="border p-2 w-full mb-4 rounded"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🔐 Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>

        {/* Admin Tools */}
        <div className="grid grid-cols-1 gap-6">
          <AdminResetPassword />
          {/* You can add more admin tools here later */}
        </div>
      </div>
    </div>
  );
}
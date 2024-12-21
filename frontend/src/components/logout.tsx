// components/Logout.tsx

import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Logout = () => {
  const navigate=useNavigate();

  const logout = () => {
    // Clear session or JWT token
    localStorage.removeItem("accessToken");

    // Optionally, you can reset other application states like user info, etc.

    // Redirect user to login page
    // history.push("/login");
    navigate("/login")
  };

  return (
    <button
      onClick={logout}
      className="fixed top-4 right-4 p-2 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-600"
    >
      <LogOut size={20} />
    </button>
  );
};

export { Logout };

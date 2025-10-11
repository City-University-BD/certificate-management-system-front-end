import { FileText, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

interface FacultyData {
  _id: string;
  name: string;
  email: string;
  facultyId: string;
  phone: string;
  image: string;
  role: number;
  department: string;
  designation: string;
}

const FacultyDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [facultyInfo, setFacultyInfo] = useState<FacultyData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load faculty info from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.faculty) {
          setFacultyInfo(parsedData.faculty);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const isActive = (path: string) => {
    if (path === "/faculty-dashboard") {
      return location.pathname === path;
    }
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");

    // Navigate to login page
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Certificate Management System
              </h1>
              <p className="text-sm text-gray-600">Faculty Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-20 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-30 overflow-y-auto`}
        >
          <nav className="p-4 space-y-1">
            <button
              onClick={() => navigate("/faculty-dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive("/faculty-dashboard")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">All Applications</span>
            </button>
          </nav>

          {/* Faculty Information */}
          <div className="p-4 border-t border-gray-200">
            <p className="font-semibold text-gray-900 mb-3">My Information</p>
            {facultyInfo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {facultyInfo.image && facultyInfo.image !== "johndoe.jpg" ? (
                    <img
                      src={facultyInfo.image}
                      alt={facultyInfo.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {facultyInfo.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {facultyInfo.designation}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Faculty ID:</span>
                    <span className="font-medium text-gray-900">
                      {facultyInfo.facultyId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium text-gray-900 uppercase">
                      {facultyInfo.department}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-500 mb-1">Email:</p>
                    <p className="font-medium text-gray-900 break-all">
                      {facultyInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Phone:</p>
                    <p className="font-medium text-gray-900">
                      {facultyInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No information available
              </div>
            )}
          </div>
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content - Outlet renders child routes here */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;

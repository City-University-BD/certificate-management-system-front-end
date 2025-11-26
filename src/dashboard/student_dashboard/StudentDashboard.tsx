import { Clock, FileText, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

interface StudentData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  department: string;
  image?: string;
  isApplied: boolean;
}

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadStudentData = async () => {
      const userData = localStorage.getItem("userData");

      if (!userData) return;

      try {
        const parsedData = JSON.parse(userData);

        if (parsedData.studentData && parsedData.studentData._id) {
          const id = parsedData.studentData._id;

          // Fetch student profile from API
          const res = await fetch(
            `https://server-side-rho-snowy.vercel.app/student/profile/${id}`
          );

          const data = await res.json();

          if (data) {
            setStudentData(data.data);
          } else {
            console.error("Invalid response format:", data);
          }
        }
      } catch (error) {
        console.error("Error parsing or fetching student data:", error);
      }
    };

    loadStudentData();
  }, []);

  const isActive = (path: string) => {
    if (path === "/student-dashboard") {
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
              <p className="text-sm text-gray-600">Student Dashboard</p>
            </div>
          </div>
          {studentData && (
            <div className="hidden md:flex items-center gap-3">
              {studentData.image && studentData.image !== "abc.jpg" ? (
                <img
                  src={studentData.image}
                  alt={studentData.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-200 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {studentData.name}
                </p>
                <p className="text-xs text-gray-500">{studentData.studentId}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-30 flex flex-col`}
        >
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => navigate("/student-dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive("/student-dashboard") &&
                !isActive("/certificate") &&
                !isActive("/status")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">My Information</span>
            </button>

            {studentData?.isApplied ? (
              // Show Check Status if already applied
              <button
                onClick={() => navigate("/student-dashboard/status")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/status")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-medium">Check Status</span>
              </button>
            ) : (
              // Show Apply Certificate if not applied
              <button
                onClick={() => navigate("/student-dashboard/certificate")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/certificate")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Apply Certificate</span>
              </button>
            )}

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all hover:shadow-sm font-medium hover:cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
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

export default StudentDashboard;

import { FileText, LogOut, Menu, Upload, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

interface ExamControllerData {
  _id: string;
  name: string;
  email: string;
  examId: string;
  phone: string;
  image: string;
  role: number;
  signature?: string;
}

const ExamControllerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [examControllerInfo, setExamController] =
    useState<ExamControllerData | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load faculty info from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.data) {
          setExamController(parsedData.data);
          // Load signature if exists
          if (parsedData.data.signature) {
            setSignaturePreview(parsedData.data.signature);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  const handleSignatureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSignaturePreview(base64String);

        // Update facultyInfo with signature
        if (examControllerInfo) {
          const updatedInfo = {
            ...examControllerInfo,
            signature: base64String,
          };
          setExamController(updatedInfo);
          console.log(updatedInfo);

          // Update localStorage
          const userData = localStorage.getItem("userData");
          if (userData) {
            const parsedData = JSON.parse(userData);
            parsedData.data.signature = base64String;
            localStorage.setItem("userData", JSON.stringify(parsedData));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setSignaturePreview(null);
    if (examControllerInfo) {
      const updatedInfo = { ...examControllerInfo, signature: undefined };
      setExamController(updatedInfo);

      // Update localStorage
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        delete parsedData.data.signature;
        localStorage.setItem("userData", JSON.stringify(parsedData));
      }
    }
  };

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
              <p className="text-sm text-gray-600">Exam Controller Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-30 flex flex-col`}
        >
          {/* Navigation Menu */}
          <nav className="p-1 space-y-1">
            <Link
              to={`/exam-controller-dashboard`}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:cursor-pointer rounded-lg transition-colors ${
                isActive("/faculty-dashboard")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-3 h-3" />
              <span className="font-medium">Ongoing Applications</span>
            </Link>
          </nav>
          <nav className="p-1 space-y-1">
            <Link
              to={`/exam-controller-dashboard/approved-applications`}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:cursor-pointer rounded-lg transition-colors ${
                isActive("/faculty-dashboard")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-3 h-3" />
              <span className="font-medium">Approved Applications</span>
            </Link>
          </nav>

          {/* Faculty Information - Grows to fill space */}
          <div className="flex-1 overflow-y-auto p-4 border-t border-gray-200">
            <p className="font-semibold text-center text-gray-900 mb-3">
              My Information
            </p>
            {examControllerInfo ? (
              <div className="space-y-4">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center pb-3 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-2">
                    {/* <User className="w-8 h-8 text-white" /> */}
                    <img
                      src={examControllerInfo.image}
                      alt=""
                      className="w-8 h-8"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {examControllerInfo.name}
                  </p>
                </div>

                {/* Details Section */}
                <div className="space-y-3 text-xs">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500 mb-1">ExamController ID</p>
                    <p className="font-semibold text-gray-900">
                      {examControllerInfo.examId}
                    </p>
                  </div>
                  {/* 
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500 mb-1">Department</p>
                    <p className="font-semibold text-gray-900 uppercase">
                      {examControllerInfo.department}
                    </p>
                  </div> */}

                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900 break-all">
                      {examControllerInfo.email}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">
                      {examControllerInfo.phone}
                    </p>
                  </div>

                  {/* Signature Section */}
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500 mb-2">Digital Signature</p>
                    {signaturePreview ? (
                      <div className="space-y-2">
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
                          <img
                            src={signaturePreview}
                            alt="Signature"
                            className="max-h-20 max-w-full object-contain"
                          />
                        </div>
                        <div className="flex gap-2">
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSignatureUpload}
                              className="hidden"
                            />
                            <div className="flex items-center justify-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-xs font-medium">
                              <Upload className="w-3 h-3" />
                              Change
                            </div>
                          </label>
                          <button
                            onClick={removeSignature}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-xs font-medium"
                          >
                            <X className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureUpload}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
                          <Upload className="w-6 h-6 text-gray-400 mb-1" />
                          <p className="text-xs text-gray-600 font-medium">
                            Upload Signature
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            PNG, JPG (Max 2MB)
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <User className="w-12 h-12 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  No information available
                </p>
              </div>
            )}
          </div>

          {/* Logout Button - Sticky at bottom */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-red-600 bg-red-100 hover:bg-red-300 transition-all hover:shadow-sm font-medium hover:cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
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

export default ExamControllerDashboard;

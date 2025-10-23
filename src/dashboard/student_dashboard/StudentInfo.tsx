import { Building2, Hash, Loader2, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";

// Interface
interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  department: string;
  image?: string;
  isApplied?: boolean;
}

const StudentInfo = () => {
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch student data from localStorage
  useEffect(() => {
    const fetchStudentData = () => {
      try {
        setIsLoading(true);

        // Get userData from localStorage
        const userData = localStorage.getItem("userData");

        if (!userData) {
          throw new Error("No user data found. Please login again.");
        }

        // Parse the JSON data
        const parsedData = JSON.parse(userData);

        // Check if student data exists
        if (!parsedData.studentData) {
          throw new Error("Student information not found");
        }

        // Set the student data
        setStudentData(parsedData.studentData);
        setError(null);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load student information. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Save updated student data
  const handleSave = async () => {
    if (!studentData) return;

    try {
      setIsSaving(true);

      // Get token from localStorage
      const authToken = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (!authToken) {
        throw new Error("No authentication token found");
      }

      if (!userData) {
        throw new Error("No user data found");
      }

      const response = await fetch(
        "https://server-side-rho-snowy.vercel.app/student/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            name: studentData.name,
            email: studentData.email,
            phone: studentData.phone,
            department: studentData.department,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error("Failed to update profile");
      }

      const result = await response.json();

      // Update localStorage with new data
      const parsedUserData = JSON.parse(userData);
      parsedUserData.data = { ...studentData, ...result.data };
      localStorage.setItem("userData", JSON.stringify(parsedUserData));

      setStudentData(parsedUserData.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing and restore original data
  const handleCancel = () => {
    setIsEditing(false);
    // Reload data from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.data) {
        setStudentData(parsedData.data);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading student information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !studentData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Data
          </h3>
          <p className="text-gray-600 mb-4">
            {error || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Student Information
        </h1>
        <p className="text-gray-600 mt-1">
          View and manage your personal details
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 pb-6 border-b border-gray-200">
          <div className="relative">
            {studentData.image && studentData.image !== "abc.jpg" ? (
              <img
                src={studentData.image}
                alt={studentData.name}
                className="w-24 h-24 rounded-full border-4 border-blue-100 shadow-sm object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-blue-100 shadow-sm bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {studentData.name}
            </h2>
            <p className="text-gray-600 mt-1">
              Student ID: {studentData.studentId}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {studentData.department}
              </span>
              {studentData.isApplied && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Applied
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Information Grid */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded"></span>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={studentData.name}
                  onChange={(e) =>
                    setStudentData({ ...studentData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                  {studentData.name}
                </p>
              )}
            </div>

            {/* Student ID Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Student ID
              </label>
              <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                {studentData.studentId}
              </p>
              <p className="text-xs text-gray-500">
                Student ID cannot be changed
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                {studentData.email}
              </p>
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={studentData.phone}
                  onChange={(e) =>
                    setStudentData({ ...studentData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                  {studentData.phone}
                </p>
              )}
            </div>

            {/* Department Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Department
              </label>
              {isEditing ? (
                <select
                  value={studentData.department}
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      department: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">
                    Electrical Engineering
                  </option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Business Administration">
                    Business Administration
                  </option>
                  <option value="Mathematics">Mathematics</option>
                </select>
              ) : (
                <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                  {studentData.department}
                </p>
              )}
            </div>
          </div>

          {/* Save Button (only shown when editing) */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            Change Password
          </button>
          <button className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
            Download ID Card
          </button>
          <button className="px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;

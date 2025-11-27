import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Filter, Loader2, Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

interface Application {
  _id: string;
  studentId: string;
  studentName: string;
  program: string;
  batch: string;
  mobile?: string;
  email?: string;
  applicationType: number;
  applicationStatus: number;
  createdAt: string;
  paymentStatus?: number;
  clearance?: {
    accounts: { status: number };
    library: { status: number };
    examController: { status: number };
    faculty: { status: number };
  };
}

const ExamControllerApplicationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Get examId from localStorage
        const userData = localStorage.getItem("userData");
        const parsedUser = userData ? JSON.parse(userData) : null;
        const examId = parsedUser?.data?.examId;

        if (!examId) {
          throw new Error("Exam ID not found in localStorage");
        }

        // ✅ Updated API endpoint with examId query param
        const response = await fetch(
          `https://server-side-rho-snowy.vercel.app/application/role/examController?examId=${examId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch applications: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 200 && result.data) {
          setApplications(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch applications");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status: number) => {
    const statusMap = {
      0: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      1: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
      2: { label: "Approved", color: "bg-green-100 text-green-800" },
      3: { label: "Rejected", color: "bg-red-100 text-red-800" },
    };
    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap[0];
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const getApplicationType = (type: number) => {
    return type === 0 ? "Provisional" : "Final";
  };

  const getClearanceStatus = (status: number) => {
    const statusMap = {
      0: "Pending",
      1: "Approved",
      2: "Rejected",
    };
    return statusMap[status as keyof typeof statusMap] || "Pending";
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      app.applicationStatus.toString() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <XCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Applications
              </h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">All Applications</h2>
        <p className="text-gray-600 mt-1">
          Manage and review all certificate applications ({applications.length}{" "}
          total)
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, student ID, or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="1">In Progress</option>
                <option value="2">Approved</option>
                <option value="3">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.map((app) => (
          <Card key={app._id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.studentName}
                    </h3>
                    {getStatusBadge(app.applicationStatus)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Student ID:</span>{" "}
                      {app.studentId}
                    </div>
                    <div>
                      <span className="font-medium">Program:</span>{" "}
                      {app.program}
                    </div>
                    <div>
                      <span className="font-medium">Batch:</span> {app.batch}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {getApplicationType(app.applicationType)}
                    </div>
                    <div>
                      <span className="font-medium">Applied:</span>{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                    {app.paymentStatus !== undefined && (
                      <div>
                        <span className="font-medium">Payment:</span>{" "}
                        <span
                          className={`font-semibold ${
                            app.paymentStatus === 1
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {app.paymentStatus === 1 ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    )}
                  </div>

                  {app.clearance && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        Accounts:{" "}
                        {getClearanceStatus(app.clearance.accounts.status)}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        Library:{" "}
                        {getClearanceStatus(app.clearance.library.status)}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        Exam:{" "}
                        {getClearanceStatus(
                          app.clearance.examController.status
                        )}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        Faculty:{" "}
                        {getClearanceStatus(app.clearance.faculty.status)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[180px]">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    <Link to={`application/${app._id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">
                No applications found matching your criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExamControllerApplicationList;

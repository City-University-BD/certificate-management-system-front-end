import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Eye,
  Filter,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

interface Application {
  _id: string;
  studentId: string;
  studentName: string;
  program: string;
  batch: string;
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

const ApplicationsList = ({
  role,
  url,
}: {
  role: string;
  url: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!role) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const facultydata = localStorage.getItem("userData");
        let facultyId = null;
      
        if(facultydata){
           const parsedData = JSON.parse(facultydata);
            facultyId = parsedData?.facultyId
        }
        // 🔥 Build URL safely
        let apiUrl = `https://server-side-rho-snowy.vercel.app/application/role/${role}`;

        if (role === "faculty") {
          if (!facultyId) {
            throw new Error("Faculty ID not found. Please login again.");
          }
          apiUrl += `?facultyId=${facultyId}`;
        }

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Failed to fetch applications");
        }

        setApplications(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [role]);

  /* ================= HELPERS ================= */
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getApplicationType = (type: number) =>
    type === 0 ? "Provisional" : "Final";

  const getClearanceStatus = (status: number) => {
    const map: Record<number, string> = {
      0: "Pending",
      1: "Approved",
      2: "Rejected",
    };
    return map[status] || "Pending";
  };

  /* ================= FILTER ================= */
  const filteredApplications = applications.filter((app) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      app.studentName.toLowerCase().includes(search) ||
      app.studentId.toLowerCase().includes(search) ||
      app.program.toLowerCase().includes(search);

    const matchesStatus =
      filterStatus === "all" ||
      app.applicationStatus.toString() === filterStatus;

    return matchesSearch && matchesStatus;
  });

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Applications
            </h3>
            <p className="text-gray-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">All Applications</h2>
        <p className="text-gray-600">
          Total: {applications.length}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 flex gap-4 flex-col md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, ID or program"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="1">In Progress</option>
              <option value="2">Approved</option>
              <option value="3">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredApplications.map((app) => (
          <Card key={app._id}>
            <CardContent className="pt-6 flex flex-col lg:flex-row justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {app.studentName}
                </h3>

                <div className="text-sm text-gray-600 grid md:grid-cols-2 lg:grid-cols-3 gap-1">
                  <p><b>ID:</b> {app.studentId}</p>
                  <p><b>Program:</b> {app.program}</p>
                  <p><b>Batch:</b> {app.batch}</p>
                  <p><b>Type:</b> {getApplicationType(app.applicationType)}</p>
                  <p><b>Applied:</b> {formatDate(app.createdAt)}</p>
                </div>

                {app.clearance && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Accounts: {getClearanceStatus(app.clearance.accounts.status)}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Library: {getClearanceStatus(app.clearance.library.status)}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Exam: {getClearanceStatus(app.clearance.examController.status)}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Faculty: {getClearanceStatus(app.clearance.faculty.status)}
                    </span>
                  </div>
                )}
              </div>

              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                <Link to={`${url}/application/${app._id}`}>
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-gray-500">
              No applications found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;

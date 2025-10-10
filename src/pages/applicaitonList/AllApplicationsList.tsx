import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Eye, Filter, Search, XCircle } from "lucide-react";
import { useState } from "react";

interface Application {
  _id: string;
  studentId: string;
  studentName: string;
  program: string;
  batch: string;
  mobile: string;
  email: string;
  applicationType: number;
  applicationStatus: number;
  applicationDate: string;
  paymentStatus: number;
  clearance: {
    accounts: { status: number };
    library: { status: number };
    examController: { status: number };
    faculty: { status: number };
  };
}

const AllApplicationsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectAppId, setRejectAppId] = useState("");

  // Demo data based on the provided structure
  const demoApplications: Application[] = [
    {
      _id: "68d4e8555c28f17dde99dc48",
      studentId: "STU123",
      studentName: "Rahim Uddin",
      program: "CSE",
      batch: "50",
      mobile: "01711112222",
      email: "rahim@example.com",
      applicationType: 0,
      applicationStatus: 0,
      applicationDate: "2025-09-25T06:59:33.389Z",
      paymentStatus: 1,
      clearance: {
        accounts: { status: 0 },
        library: { status: 0 },
        examController: { status: 0 },
        faculty: { status: 0 },
      },
    },
    {
      _id: "68d4e8555c28f17dde99dc49",
      studentId: "STU124",
      studentName: "Fatima Rahman",
      program: "BBA",
      batch: "48",
      mobile: "01811223344",
      email: "fatima@example.com",
      applicationType: 1,
      applicationStatus: 1,
      applicationDate: "2025-09-20T08:30:00.000Z",
      paymentStatus: 1,
      clearance: {
        accounts: { status: 1 },
        library: { status: 1 },
        examController: { status: 0 },
        faculty: { status: 1 },
      },
    },
    {
      _id: "68d4e8555c28f17dde99dc50",
      studentId: "STU125",
      studentName: "Karim Hossain",
      program: "EEE",
      batch: "49",
      mobile: "01922334455",
      email: "karim@example.com",
      applicationType: 0,
      applicationStatus: 2,
      applicationDate: "2025-09-18T10:15:00.000Z",
      paymentStatus: 1,
      clearance: {
        accounts: { status: 2 },
        library: { status: 1 },
        examController: { status: 1 },
        faculty: { status: 1 },
      },
    },
    {
      _id: "68d4e8555c28f17dde99dc51",
      studentId: "STU126",
      studentName: "Nazia Ahmed",
      program: "English",
      batch: "51",
      mobile: "01733445566",
      email: "nazia@example.com",
      applicationType: 1,
      applicationStatus: 0,
      applicationDate: "2025-09-26T14:20:00.000Z",
      paymentStatus: 0,
      clearance: {
        accounts: { status: 0 },
        library: { status: 0 },
        examController: { status: 0 },
        faculty: { status: 0 },
      },
    },
  ];

  const [applications] = useState<Application[]>(demoApplications);

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

  const handleViewApplication = (app: Application) => {
    setSelectedApplication(app);
    setShowModal(true);
  };

  const handleApproveApplication = (appId: string) => {
    console.log("Approving application:", appId);
    // API call to approve application
    alert(`Application ${appId} approved!`);
  };

  const handleRejectApplication = (appId: string) => {
    setRejectAppId(appId);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    console.log("Rejecting application:", rejectAppId, "Reason:", rejectReason);
    // API call to reject application with reason
    alert(`Application ${rejectAppId} rejected!\nReason: ${rejectReason}`);
    setShowRejectModal(false);
    setRejectReason("");
    setRejectAppId("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">All Applications</h2>
        <p className="text-gray-600 mt-1">
          Manage and review all certificate applications
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
                <option value="0">Pending</option>
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
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </div>
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
                  </div>

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
                      {getClearanceStatus(app.clearance.examController.status)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      Faculty:{" "}
                      {getClearanceStatus(app.clearance.faculty.status)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[180px]">
                  <Button
                    onClick={() => handleViewApplication(app)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleApproveApplication(app._id)}
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                    disabled={app.applicationStatus === 2}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRejectApplication(app._id)}
                    variant="destructive"
                    className="w-full justify-start"
                    disabled={app.applicationStatus === 3}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
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

      {/* View Application Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Application Details</CardTitle>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">Student Name</p>
                  <p className="text-gray-900">
                    {selectedApplication.studentName}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Student ID</p>
                  <p className="text-gray-900">
                    {selectedApplication.studentId}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Program</p>
                  <p className="text-gray-900">{selectedApplication.program}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Batch</p>
                  <p className="text-gray-900">{selectedApplication.batch}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Email</p>
                  <p className="text-gray-900">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Mobile</p>
                  <p className="text-gray-900">{selectedApplication.mobile}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">
                    Application Type
                  </p>
                  <p className="text-gray-900">
                    {getApplicationType(selectedApplication.applicationType)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">
                    Application Date
                  </p>
                  <p className="text-gray-900">
                    {new Date(
                      selectedApplication.applicationDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Clearance Status
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">Accounts</p>
                    <p className="text-sm">
                      {getClearanceStatus(
                        selectedApplication.clearance.accounts.status
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">Library</p>
                    <p className="text-sm">
                      {getClearanceStatus(
                        selectedApplication.clearance.library.status
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">Exam Controller</p>
                    <p className="text-sm">
                      {getClearanceStatus(
                        selectedApplication.clearance.examController.status
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">Faculty</p>
                    <p className="text-sm">
                      {getClearanceStatus(
                        selectedApplication.clearance.faculty.status
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  onClick={() =>
                    handleApproveApplication(selectedApplication._id)
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    handleRejectApplication(selectedApplication._id);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reject Application Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-red-600">
                  Reject Application
                </CardTitle>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                    setRejectAppId("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Please provide a reason for rejecting this application. This
                message will be sent to the student.
              </p>
              <div>
                <label
                  htmlFor="rejectReason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason for Rejection *
                </label>
                <textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
                  placeholder="Enter the reason for rejection..."
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                    setRejectAppId("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmReject}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Confirm Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AllApplicationsList;

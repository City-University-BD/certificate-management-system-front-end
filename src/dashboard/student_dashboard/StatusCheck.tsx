import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Download,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ClearanceStatus {
  status?: number;
  message: string;
  date: string;
}

interface Clearance {
  faculty: ClearanceStatus;
  accounts: ClearanceStatus;
  library: ClearanceStatus;
  examController: ClearanceStatus;
  administrator: ClearanceStatus;
  hod: ClearanceStatus;
  controller: ClearanceStatus;
}

interface Application {
  _id: string;
  studentId: string;
  studentName: string;
  program: string;
  batch: string;
  creditCompleted: number;
  creditWaived: number;
  campus: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  lastSemester: string;
  passingYear: number;
  applicationType: number;
  applicationStatus: number;
  sscCertificate: string;
  hscCertificate: string;
  paymentStatus: number;
  paymentAmount: number;
  remarks: string;
  applicationDate: string;
  clearance: Clearance;
  createdAt: string;
  updatedAt: string;
}

const StatusCheck = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        setIsLoading(true);

        // Get student ID from localStorage
        const userData = localStorage.getItem("userData");
        if (!userData) {
          setError("No user data found. Please login again.");
          return;
        }

        const parsedData = JSON.parse(userData);
        const studentId = parsedData.data?.studentId;

        if (!studentId) {
          setError("Student ID not found.");
          return;
        }

        // Fetch application data
        const response = await fetch(
          `https://server-side-rho-snowy.vercel.app/application/own?studentId=${studentId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch application data");
        }

        const result = await response.json();

        if (result.status === 200 && result.data) {
          setApplication(result.data);
        } else {
          setError("No application found.");
        }
      } catch (err) {
        console.error("Error fetching application:", err);
        setError("Failed to load application data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationStatus();
  }, []);

  const getApplicationTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return "Provisional Certificate";
      case 1:
        return "Final Certificate";
      case 2:
        return "Transcript";
      default:
        return "Unknown";
    }
  };

  const getApplicationStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 1:
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 2:
        return <Badge className="bg-green-500">Approved</Badge>;
      case 3:
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge className="bg-orange-500">Not Paid</Badge>;
      case 1:
        return <Badge className="bg-green-500">Paid</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getClearanceStatusIcon = (status?: number) => {
    if (status === undefined)
      return <Clock className="h-5 w-5 text-yellow-500" />;

    switch (status) {
      case 0:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 2:
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getClearanceStatusText = (status?: number) => {
    if (status === undefined) return "Pending";

    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Application Status
          </h1>
          <p className="text-gray-600 mt-1">
            Track your certificate applications
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Application Status
          </h1>
          <p className="text-gray-600 mt-1">
            Track your certificate applications
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No application found</p>
              <p className="text-gray-500 text-sm mt-2">
                You haven't submitted any certificate application yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
        <p className="text-gray-600 mt-1">Track your certificate application</p>
      </div>

      {/* Application Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>
                Applied on:{" "}
                {new Date(application.applicationDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {getApplicationStatusBadge(application.applicationStatus)}
              {getPaymentStatusBadge(application.paymentStatus)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium">{application.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Student Name</p>
              <p className="font-medium">{application.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium">{application.program}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Batch</p>
              <p className="font-medium">{application.batch}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Application Type</p>
              <p className="font-medium">
                {getApplicationTypeLabel(application.applicationType)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Campus</p>
              <p className="font-medium">{application.campus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Credit Completed</p>
              <p className="font-medium">{application.creditCompleted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Credit Waived</p>
              <p className="font-medium">{application.creditWaived}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Passing Year</p>
              <p className="font-medium">{application.passingYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Semester</p>
              <p className="font-medium">{application.lastSemester}</p>
            </div>
          </div>

          {application.remarks && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Remarks</p>
              <p className="font-medium">{application.remarks}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <div className="mt-1">
                {getPaymentStatusBadge(application.paymentStatus)}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Amount</p>
              <p className="font-medium text-lg">
                {application.paymentAmount > 0
                  ? `৳${application.paymentAmount.toLocaleString()}`
                  : "Not Set"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clearance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Clearance Status</CardTitle>
          <CardDescription>
            Track approvals from different departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Faculty */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getClearanceStatusIcon(application.clearance.faculty.status)}
                <div>
                  <p className="font-medium">Faculty</p>
                  {application.clearance.faculty.message && (
                    <p className="text-sm text-gray-500">
                      {application.clearance.faculty.message}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="outline">
                {getClearanceStatusText(application.clearance.faculty.status)}
              </Badge>
            </div>

            {/* Accounts */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getClearanceStatusIcon(application.clearance.accounts.status)}
                <div>
                  <p className="font-medium">Accounts</p>
                  {application.clearance.accounts.message && (
                    <p className="text-sm text-gray-500">
                      {application.clearance.accounts.message}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="outline">
                {getClearanceStatusText(application.clearance.accounts.status)}
              </Badge>
            </div>

            {/* Library */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getClearanceStatusIcon(application.clearance.library.status)}
                <div>
                  <p className="font-medium">Library</p>
                  {application.clearance.library.message && (
                    <p className="text-sm text-gray-500">
                      {application.clearance.library.message}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="outline">
                {getClearanceStatusText(application.clearance.library.status)}
              </Badge>
            </div>

            {/* Exam Controller */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getClearanceStatusIcon(
                  application.clearance.examController.status
                )}
                <div>
                  <p className="font-medium">Exam Controller</p>
                  {application.clearance.examController.message && (
                    <p className="text-sm text-gray-500">
                      {application.clearance.examController.message}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="outline">
                {getClearanceStatusText(
                  application.clearance.examController.status
                )}
              </Badge>
            </div>

            {/* HOD */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getClearanceStatusIcon(application.clearance.hod.status)}
                <div>
                  <p className="font-medium">Head of Department</p>
                  {application.clearance.hod.message && (
                    <p className="text-sm text-gray-500">
                      {application.clearance.hod.message}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="outline">
                {getClearanceStatusText(application.clearance.hod.status)}
              </Badge>
            </div>

            {/* Administrator */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getClearanceStatusIcon(
                  application.clearance.administrator.status
                )}
                <div>
                  <p className="font-medium">Administrator</p>
                  {application.clearance.administrator.message && (
                    <p className="text-sm text-gray-500">
                      {application.clearance.administrator.message}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="outline">
                {getClearanceStatusText(
                  application.clearance.administrator.status
                )}
              </Badge>
            </div>

            {/* Controller */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getClearanceStatusIcon(
                  application.clearance.controller.status
                )}
                <div>
                  <p className="font-medium">Controller</p>
                  {application.clearance.controller.message && (
                    <p className="text-sm text-gray-500">
                      {application.clearance.controller.message}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="outline">
                {getClearanceStatusText(
                  application.clearance.controller.status
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="font-medium mb-2">SSC Certificate</p>
              <a
                href={application.sscCertificate}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Download className="h-4 w-4" />
                View Certificate
              </a>
            </div>
            <div className="border rounded-lg p-4">
              <p className="font-medium mb-2">HSC Certificate</p>
              <a
                href={application.hscCertificate}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Download className="h-4 w-4" />
                View Certificate
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusCheck;

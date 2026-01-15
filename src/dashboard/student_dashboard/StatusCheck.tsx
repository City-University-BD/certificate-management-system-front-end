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
  Download,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

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
  register: ClearanceStatus;
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
  const [resubmit, setResubmit] = useState<number>(0);

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
    
        const studentId = parsedData.studentId;
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
        setResubmit(result.data?.applicationStatus);
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

  const clearanceSteps = [
    { label: "Exam Controller", key: "examController" },
    { label: "Faculty", key: "faculty" },
    { label: "Library", key: "library" },
    { label: "Accounts", key: "accounts" },
    { label: "Registrar", key: "registrar" },
  ];

  const getCurrentClearanceStep = (clearance: Clearance) => {
    const steps = [
      "examController",
      "faculty",
      "library",
      "accounts",
      "registrar",
    ];

    // Find the last approved step
    let lastApproved = -1;
    for (let i = 0; i < steps.length; i++) {
      const stepKey = steps[i] as keyof Clearance;
      if (clearance[stepKey]?.status === 1) {
        lastApproved = i;
      }
    }

    // Check if any step is rejected
    for (let i = 0; i < steps.length; i++) {
      const stepKey = steps[i] as keyof Clearance;
      if (clearance[stepKey]?.status === 2) {
        return { currentStep: i, isRejected: true };
      }
    }

    // Return next pending step
    return { currentStep: lastApproved + 1, isRejected: false };
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

  const { currentStep, isRejected } = getCurrentClearanceStep(
    application.clearance
  );

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
        <div className="flex justify-between">
          <p className="text-gray-600 mt-1">
            Track your certificate application
          </p>
          <p className="text-gray-600 mt-1 text-right">
            Your tracking Id:{" "}
            <span className="hover:cursor-pointer hover:underline text-blue-500">
              {application?.studentId}
            </span>
          </p>
        </div>
      </div>

      {/* Clearance Stepper */}
      <Card>
        <CardHeader>
          <CardTitle>Clearance Progress</CardTitle>
          <CardDescription>
            Track approvals from different departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRejected ? (
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-red-600">
                Clearance Rejected
              </p>
              <p className="text-gray-600 mt-2">
                One or more departments have rejected your clearance
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <div className="flex justify-between items-start min-w-max px-4">
                {clearanceSteps.map((step, index) => {
                  const stepKey = step.key as keyof Clearance;
                  const stepStatus = application.clearance[stepKey]?.status;
                  console.log(stepStatus);
                  const isCompleted = stepStatus === 1;
                  const isCurrent = index === currentStep && !isCompleted;
                  // const isUpcoming = index > currentStep;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1 relative min-w-[100px]"
                    >
                      {/* Line before step (except first) */}
                      {index !== 0 && (
                        <div
                          className={`absolute top-5 right-1/2 w-full h-0.5 -z-10 ${
                            isCompleted ||
                            (index <= currentStep &&
                              application.clearance[
                                clearanceSteps[index - 1].key as keyof Clearance
                              ].status === 1)
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                          style={{ transform: "translateY(-50%)" }}
                        />
                      )}

                      {/* Step Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all ${
                          isCompleted
                            ? "bg-green-500 border-green-500"
                            : stepStatus === -1
                            ? "bg-red-500 border-red-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : stepStatus === -1 ? (
                          <XCircle className="h-6 w-6 text-white" />
                        ) : (
                          <span className="text-gray-400 font-semibold text-xs">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Step Label */}
                      <p
                        className={`text-xs font-medium text-center ${
                          isCompleted || isCurrent
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>

                      {/* Step Status */}
                      {stepStatus === 0 && (
                        <Badge className="mt-2 bg-blue-500 text-xs">
                          Pending
                        </Badge>
                      )}
                      {stepStatus === 1 && (
                        <Badge className="mt-2 bg-green-500 text-xs">
                          Approved
                        </Badge>
                      )}
                      {stepStatus === -1 && (
                        <Badge className="mt-2 bg-red-500 text-xs">
                          Rejected
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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

      {resubmit === -1 && (
        <Link to={"/student-dashboard/certificate"}>
          <Badge className="bg-red-500 text-white p-2 hover:cursor-pointer">
            Resubmit Application
          </Badge>
        </Link>
      )}
    </div>
  );
};

export default StatusCheck;

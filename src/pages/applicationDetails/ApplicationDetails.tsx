import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

interface ClearanceItem {
  status: number;
  date: string | null;
  message: string;
}

interface ApplicationData {
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
  sscCertificate: string | null;
  hscCertificate: string | null;
  paymentStatus: number;
  paymentAmount: number;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  applicationDate: string;
  clearance: {
    faculty: ClearanceItem;
    accounts: ClearanceItem;
    library: ClearanceItem;
    examController: ClearanceItem;
    administrator: ClearanceItem;
    hod: ClearanceItem;
    controller: ClearanceItem;
  };
}

const ApplicationDetails = ({ role }: { role: string }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationData | null>(null);
  // const [isApproved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://server-side-rho-snowy.vercel.app/application/${id}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch application details: ${response.status}`
          );
        }

        const result = await response.json();
        if (result.status === 200 && result.data) {
          setApplication(result.data);
        } else {
          throw new Error(
            result.message || "Failed to fetch application details"
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching application details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicationDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleApprove = async () => {
    if (!id) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(
        `https://server-side-rho-snowy.vercel.app/application/clearance/${role}/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: 1, message: "" }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setApplication(data.data);
        // setApproved(true);
        toast("Application approved successfully ✅");
      } else {
        throw new Error(data.message || "Approval failed");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      console.log("data:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `https://server-side-rho-snowy.vercel.app/application/clearance/${role}/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: -1, message: rejectMessage }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Application rejected ❌");
        setApplication((prev) =>
          prev
            ? {
                ...prev,
                clearance: {
                  ...prev.clearance,
                  faculty: {
                    ...prev.clearance.faculty,
                    status: -1,
                    message: rejectMessage,
                  },
                },
              }
            : prev
        );
        setShowRejectModal(false);
        setRejectMessage("");
      } else {
        throw new Error(data.message || "Rejection failed");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getApplicationType = (type: number) => {
    return type === 0 ? "Provisional Certificate" : "Final Certificate";
  };

  const getClearanceStatusBadge = (status: number) => {
    const statusMap = {
      0: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      1: {
        label: "Approved",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      2: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
    };
    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap[0];
    const Icon = statusInfo.icon;

    if (status === -1) {
      statusInfo.label = "Rejected";
      statusInfo.color = "bg-red-100 text-red-800";
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}
      >
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application details...</p>
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
                Error Loading Application
              </h3>
              <p className="text-sm text-gray-600">{error}</p>
              <Button onClick={handleGoBack} variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Application not found</p>
              <Button onClick={handleGoBack} variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div id="application-details" className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Button onClick={handleGoBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-3xl font-bold text-gray-900">
              Application Details
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Application ID: {application._id}
          </p>
        </div>
      </div>

      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-base font-semibold text-gray-900">
                {application.studentName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Student ID</p>
              <p className="text-base font-semibold text-gray-900">
                {application.studentId}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Program</p>
              <p className="text-base font-semibold text-gray-900">
                {application.program}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Batch</p>
              <p className="text-base font-semibold text-gray-900">
                {application.batch}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Campus</p>
              <p className="text-base font-semibold text-gray-900">
                {application.campus}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-base font-semibold text-gray-900">
                {new Date(application.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-sm font-medium text-gray-900">
                  {application.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Mobile Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {application.mobile}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Credits Completed
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {application.creditCompleted}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Credits Waived
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {application.creditWaived}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Last Semester</p>
              <p className="text-base font-semibold text-gray-900">
                {application.lastSemester}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Passing Year</p>
              <p className="text-base font-semibold text-gray-900">
                {application.passingYear}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Application Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Application Type
              </p>
              <p className="text-base font-semibold text-gray-900">
                {getApplicationType(application.applicationType)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Application Date
              </p>
              <p className="text-base font-semibold text-gray-900">
                {new Date(application.applicationDate).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-base font-semibold text-gray-900">
                {new Date(application.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Payment Status
              </p>
              <p
                className={`text-base font-semibold ${
                  application.paymentStatus === 1
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {application.paymentStatus === 1 ? "Paid" : "Unpaid"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Payment Amount
              </p>
              <p className="text-base font-semibold text-gray-900">
                ৳{application.paymentAmount}
              </p>
            </div>
            {application.remarks && (
              <div className="space-y-1 md:col-span-2 lg:col-span-3">
                <p className="text-sm font-medium text-gray-500">Remarks</p>
                <p className="text-base text-gray-900">{application.remarks}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clearance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Clearance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(application.clearance).map(([key, value]) => (
              <div
                key={key}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h4>
                  {getClearanceStatusBadge(value.status)}
                </div>

                {value.message && (
                  <p className="text-sm text-gray-600 mb-2">{value.message}</p>
                )}

                {value.date && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(value.date).toLocaleDateString()} at{" "}
                    {new Date(value.date).toLocaleTimeString()}
                  </div>
                )}

                {!value.date && value.status === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    No action taken yet
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      {(application.sscCertificate || application.hscCertificate) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Uploaded Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.sscCertificate && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">
                    SSC Certificate
                  </p>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Certificate
                  </Button>
                </div>
              )}
              {application.hscCertificate && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">
                    HSC Certificate
                  </p>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Certificate
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Approve Application
            </Button>

            <Button
              onClick={() => setShowRejectModal(true)}
              variant="destructive"
              disabled={isSubmitting}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Application
            </Button>

            {role === "examController" && (
              <Link
                className="flex items-center hover:underline hover:cursor-pointer"
                to={`/download-details/${application._id}`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Details
              </Link>
            )}

            <Button
              variant="outline"
              onClick={handleGoBack}
              className="ml-auto hover:cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectMessage}
            onChange={(e) => setRejectMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting || !rejectMessage.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationDetails;

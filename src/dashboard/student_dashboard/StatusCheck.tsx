import { useState } from "react";

// Interface for certificate application
interface CertificateApplication {
  id: number;
  certificateType: string;
  applicationDate: string;
  status: "pending" | "processing" | "approved" | "rejected";
  submittedBy: string;
  expectedDate?: string;
  remarks?: string;
}

const StatusCheck = () => {
  // Mock data - Replace with actual API call
  const [applications] = useState<CertificateApplication[]>([
    {
      id: 1,
      certificateType: "Degree Certificate",
      applicationDate: "2024-09-15",
      status: "pending",
      submittedBy: "Alex Johnson",
      expectedDate: "2024-10-15",
      remarks: "Waiting for approval from department head",
    },
    {
      id: 2,
      certificateType: "Academic Transcript",
      applicationDate: "2024-08-20",
      status: "approved",
      submittedBy: "Alex Johnson",
      expectedDate: "2024-09-01",
      remarks: "Certificate is ready for collection",
    },
    {
      id: 3,
      certificateType: "Character Certificate",
      applicationDate: "2024-09-28",
      status: "processing",
      submittedBy: "Alex Johnson",
      expectedDate: "2024-10-10",
      remarks: "Under verification by admin office",
    },
    {
      id: 4,
      certificateType: "Bonafide Certificate",
      applicationDate: "2024-07-10",
      status: "rejected",
      submittedBy: "Alex Johnson",
      remarks: "Incomplete documents submitted",
    },
  ]);

  // Statistics
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    processing: applications.filter((a) => a.status === "processing").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
        <p className="text-gray-600 mt-1">
          Track your certificate applications
        </p>
      </div>

      {/* Search and Filter */}
      <h1>Coming Soon.....</h1>
    </div>
  );
};

export default StatusCheck;

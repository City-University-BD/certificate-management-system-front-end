import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface ClearanceItem {
  status?: number;
  date: string | null;
  message: string;
}

interface ApplicationData {
  _id: string;
  studentId: string;
  studentName: string;
  program: string;
  department?: string;
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

const DownloadDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState<ApplicationData | null>(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
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
        console.error("Error fetching application details:", err);
      }
    };

    if (id) {
      fetchApplicationDetails();
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">No application data found</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 30px !important;
          }
        }
        
        @media screen {
          .print-container {
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            background: white;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="print-container max-w-5xl mx-auto bg-white p-12">
          {/* Header */}
          <div className="flex items-center mb-1 border-b-4 border-gray-800 pb-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24  rounded-full flex items-center justify-center text-gray-500 text-xs">
                <img src="/logo_all.png" alt="City University Logo" />
              </div>
            </div>
            <div className="flex-1 text-center -ms-24">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                City University
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-1">
                Application for Transcript/Provisional Certificate
              </h2>
              <p className="text-sm text-gray-600">
                Department of {application.department || application.program}
              </p>
            </div>
          </div>

          {/* Student Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2 bg-gray-800 text-white px-4 py-2">
              Student Information
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Batch */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Batch:
                </label>
                <div className="text-base font-medium mt-1">
                  {application.batch}
                </div>
              </div>
              {/* Student ID */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Student ID:
                </label>
                <div className="text-base font-medium mt-1">
                  {application.studentId}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Student Name */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Student Name
                </label>
                <div className="text-base font-medium mt-1">
                  {application.studentName}
                </div>
              </div>
              {/* Date of Birth */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Date of Birth
                </label>
                <div className="text-base font-medium mt-1">
                  {formatDate(application.dateOfBirth)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Credit Completed */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Credit Completed
                </label>
                <div className="text-base font-medium mt-1">
                  {application.creditCompleted}
                </div>
              </div>
              {/* Credit Waived/Transferred */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Credit Waived/Transferred
                </label>
                <div className="text-base font-medium mt-1">
                  {application.creditWaived}
                </div>
              </div>
              {/* Major */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Major
                </label>
                <div className="text-base font-medium mt-1">
                  {application.program}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Campus Name */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Campus Name
                </label>
                <div className="text-base font-medium mt-1">
                  {application.campus}
                </div>
              </div>
              {/* Mobile Number */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Mobile Number
                </label>
                <div className="text-base font-medium mt-1">
                  {application.mobile}
                </div>
              </div>
              {/* Email */}
              <div className="border border-gray-300 p-3">
                <label className="text-sm font-semibold text-gray-600">
                  Email
                </label>
                <div className="text-base font-medium mt-1">
                  {application.email}
                </div>
              </div>
            </div>
          </div>

          {/* Completion Information */}
          <div className="mb-6 border border-gray-300 p-4 bg-gray-50">
            <p className="text-sm mb-3">
              I have completed all the required courses for the degree by:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Last Semester
                </label>
                <div className="text-base font-medium mt-1">
                  {application.lastSemester}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Passing Year
                </label>
                <div className="text-base font-medium mt-1">
                  {application.passingYear}
                </div>
              </div>
            </div>
          </div>

          {/* Application Type */}
          <div className="mb-6 border border-gray-300 p-4">
            <p className="text-sm font-semibold mb-3">
              I will be obliged if I am allowed to have a:
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 border-2 border-gray-800 mr-2 flex items-center justify-center ${
                    application.applicationType === 0 ? "bg-gray-800" : ""
                  }`}
                >
                  {application.applicationType === 0 && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <label className="text-sm">Transcript</label>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 border-2 border-gray-800 mr-2 flex items-center justify-center ${
                    application.applicationType === 1 ? "bg-gray-800" : ""
                  }`}
                >
                  {application.applicationType === 1 && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <label className="text-sm">Provisional Certificate</label>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 border-2 border-gray-800 mr-2 flex items-center justify-center ${
                    application.applicationType === 2 ? "bg-gray-800" : ""
                  }`}
                >
                  {application.applicationType === 2 && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <label className="text-sm">Incomplete Transcript</label>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm font-medium text-gray-800">
              <strong>Important:</strong> Before submission of this form, please
              return the ID card and Library card
            </p>
          </div>

          {/* Signature Section */}
          <div className="mb-8 border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="border-t-2 border-gray-800 w-64 mt-12 pt-2">
                  <p className="text-sm text-center">Student Signature</p>
                </div>
              </div>
              <div>
                <div className="border-t-2 border-gray-800 w-48 mt-12 pt-2">
                  <p className="text-sm text-center">Date</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clearance Table */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 bg-gray-800 text-white px-4 py-2">
              Office Clearance
            </h3>
            <table className="w-full border-collapse border-2 border-gray-800">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-2 border-gray-800 p-3 text-left font-semibold w-1/4">
                    Office
                  </th>
                  <th className="border-2 border-gray-800 p-3 text-left font-semibold">
                    Status
                  </th>
                  <th className="border-2 border-gray-800 p-3 text-left font-semibold w-1/3">
                    Seal & Signature
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Faculty Use Only */}
                <tr>
                  <td className="border-2 border-gray-800 p-4 align-top font-medium">
                    Faculty
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">
                          Applicant has completed all requirements for
                          graduation
                        </label>
                      </div>
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">
                          Applicant has not completed all requirements for
                          graduation
                        </label>
                      </div>
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="h-20"></div>
                    <p className="text-xs text-gray-600 italic mt-2">
                      Head of Department
                    </p>
                  </td>
                </tr>

                {/* Library Use Only */}
                <tr>
                  <td className="border-2 border-gray-800 p-4 align-top font-medium">
                    Library
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">
                          Applicant has returned library card
                        </label>
                      </div>
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">
                          Applicant has not returned library card
                        </label>
                      </div>
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="h-20"></div>
                    <p className="text-xs text-gray-600 italic mt-2">
                      Library In-charge
                    </p>
                  </td>
                </tr>

                {/* Accounts Use Only */}
                <tr>
                  <td className="border-2 border-gray-800 p-4 align-top font-medium">
                    Accounts
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">All dues cleared</label>
                      </div>
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">Dues pending</label>
                      </div>
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">Received Taka 500</label>
                      </div>
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">Received Taka 1000</label>
                      </div>
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">Hall clearance</label>
                      </div>
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="h-20"></div>
                    <p className="text-xs text-gray-600 italic mt-2">
                      Accounts Officer
                    </p>
                  </td>
                </tr>

                {/* Registrar Office */}
                <tr>
                  <td className="border-2 border-gray-800 p-4 align-top font-medium">
                    Registrar Office
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">
                          Applicant has completed all requirements for
                          graduation
                        </label>
                      </div>
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">
                          Applicant has not completed all requirements for
                          graduation
                        </label>
                      </div>
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="h-20"></div>
                    <p className="text-xs text-gray-600 italic mt-2">
                      Registrar
                    </p>
                  </td>
                </tr>

                {/* Controller Office */}
                <tr>
                  <td className="border-2 border-gray-800 p-4 align-top font-medium">
                    Controller Office
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">
                          Applicant has completed all requirements for
                          graduation
                        </label>
                      </div>
                      <div className="flex items-start">
                        <div className="w-4 h-4 border-2 border-gray-800 mr-2 mt-0.5"></div>
                        <label className="text-sm">
                          Applicant has not completed all requirements for
                          graduation
                        </label>
                      </div>
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-4 align-top">
                    <div className="h-20"></div>
                    <p className="text-xs text-gray-600 italic mt-2">
                      Controller of Examinations
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Contact and Collection Section */}
          <div className="mt-8 border-2 border-gray-800 p-4 bg-blue-50">
            <p className="text-sm font-semibold mb-3">
              Contact after 05 working days from the submission date of this
              form.
            </p>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm">I have checked & received by</span>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-800 mr-2"></div>
                <label className="text-sm">Transcript</label>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-800 mr-2"></div>
                <label className="text-sm">Provisional Certificate</label>
              </div>
            </div>
            <p className="text-xs italic text-gray-700 mb-4">
              N.B. Provisional Certificate must be surrendered at the time of
              taking delivery of original certificate
            </p>
            <div className="border-t-2 border-gray-800 w-64 ml-auto pt-2">
              <p className="text-sm text-center">Signature of the applicant</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
            <p>
              This is an official document. Any alteration or forgery is
              punishable by law.
            </p>
          </div>
        </div>

        {/* Print Button - Hidden when printing */}
        <div className="no-print text-center mt-6">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition duration-200"
          >
            Print Document (Ctrl+P)
          </button>
        </div>
      </div>
    </>
  );
};

export default DownloadDetails;

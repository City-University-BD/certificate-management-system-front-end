/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FormData {
  studentId: string;
  studentName: string;
  program: string;
  batch: string;
  creditCompleted: string;
  creditWaived: string;
  campus: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  lastSemester: string;
  passingYear: string;
  sscCertificate: File | null;
  hscCertificate: File | null;
  applicationType: string;
  remarks: string;
}

interface FormErrors {
  studentId?: string;
  studentName?: string;
  program?: string;
  batch?: string;
  creditCompleted?: string;
  creditWaived?: string;
  campus?: string;
  mobile?: string;
  email?: string;
  dateOfBirth?: string;
  lastSemester?: string;
  passingYear?: string;
  sscCertificate?: string;
  hscCertificate?: string;
  applicationType?: string;
  general?: string;
}

// interface Student {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   studentId: string;
//   department: string;
//   image?: string;
//   isApplied?: boolean;
// }

const CertificateApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    studentId: "",
    studentName: "",
    program: "",
    batch: "",
    creditCompleted: "",
    creditWaived: "",
    campus: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    lastSemester: "",
    passingYear: "",
    sscCertificate: null,
    hscCertificate: null,
    applicationType: "0",
    remarks: "",
  });

  // const [studentData, setStudentData] = useState<Student | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Fetch student data from localStorage and pre-fill form
  useEffect(() => {
    const fetchStudentData = () => {
      try {
        setIsLoading(true);

        // Get userData from localStorage
        const userData = localStorage.getItem("userData");

        if (!userData) {
          setErrors({
            general: "No user data found. Please login again.",
          });
          return;
        }

        // Parse the JSON data
        const parsedData = JSON.parse(userData);

        // Check if student data exists
        if (!parsedData.data) {
          setErrors({
            general: "Student information not found",
          });
          return;
        }

        // // Set the student data
        // setStudentData(parsedData.data);

        // Pre-fill the form with student data
        setFormData((prev) => ({
          ...prev,
          studentId: parsedData.data.studentId || "",
          studentName: parsedData.data.name || "",
          email: parsedData.data.email || "",
          program: parsedData.data.department || "",
        }));
      } catch (err) {
        console.error("Error fetching student data:", err);
        setErrors({
          general: "Error loading student data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.studentId.trim())
      newErrors.studentId = "Student ID is required";
    if (!formData.studentName.trim())
      newErrors.studentName = "Student Name is required";
    if (!formData.program.trim()) newErrors.program = "Program is required";
    if (!formData.batch.trim()) newErrors.batch = "Batch is required";
    if (!formData.creditCompleted.trim())
      newErrors.creditCompleted = "Credit Completed is required";
    if (!formData.creditWaived.trim())
      newErrors.creditWaived = "Credit Waived is required";
    if (!formData.campus.trim()) newErrors.campus = "Campus is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.dateOfBirth.trim())
      newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.lastSemester.trim())
      newErrors.lastSemester = "Last Semester is required";
    if (!formData.passingYear.trim())
      newErrors.passingYear = "Passing Year is required";
    if (!formData.sscCertificate)
      newErrors.sscCertificate = "SSC Certificate is required";
    if (!formData.hscCertificate)
      newErrors.hscCertificate = "HSC Certificate is required";
    if (!formData.applicationType)
      newErrors.applicationType = "Application Type is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const mobileRegex = /^[0-9]{11}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 11-digit mobile number";
    }

    if (formData.creditCompleted && isNaN(Number(formData.creditCompleted))) {
      newErrors.creditCompleted = "Credit completed must be a number";
    }
    if (formData.creditWaived && isNaN(Number(formData.creditWaived))) {
      newErrors.creditWaived = "Credit waived must be a number";
    }

    const currentYear = new Date().getFullYear();
    if (
      formData.passingYear &&
      (isNaN(Number(formData.passingYear)) ||
        Number(formData.passingYear) < 2000 ||
        Number(formData.passingYear) > currentYear + 10)
    ) {
      newErrors.passingYear = "Please enter a valid passing year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const submitData = new FormData();
      submitData.append("studentId", formData.studentId);
      submitData.append("studentName", formData.studentName);
      submitData.append("program", formData.program);
      submitData.append("batch", formData.batch);
      submitData.append("creditCompleted", formData.creditCompleted);
      submitData.append("creditWaived", formData.creditWaived);
      submitData.append("campus", formData.campus);
      submitData.append("mobile", formData.mobile);
      submitData.append("email", formData.email);
      submitData.append("dateOfBirth", formData.dateOfBirth);
      submitData.append("lastSemester", formData.lastSemester);
      submitData.append("passingYear", formData.passingYear);
      submitData.append("applicationType", formData.applicationType);
      submitData.append("remarks", formData.remarks);

      if (formData.sscCertificate) {
        submitData.append("sscCertificate", formData.sscCertificate);
      }
      if (formData.hscCertificate) {
        submitData.append("hscCertificate", formData.hscCertificate);
      }

      console.log("Submitting application with data:", {
        studentId: formData.studentId,
        studentName: formData.studentName,
        program: formData.program,
        email: formData.email,
      });

      const response = await fetch(
        "https://server-side-rho-snowy.vercel.app/application/apply",
        {
          method: "POST",
          body: submitData,
        }
      );

      if (response.ok) {
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          console.log(jsonError);
          result = { success: true };
        }
        console.log(result);

        setSuccessMessage("Certificate application submitted successfully!");
        // Update isApplied field in localStorage
        try {
          const userData = localStorage.getItem("userData");
          if (userData) {
            const parsedData = JSON.parse(userData);
            if (parsedData.data) {
              // Update the isApplied field to true
              parsedData.data.isApplied = true;
              // Save back to localStorage
              localStorage.setItem("userData", JSON.stringify(parsedData));
              console.log("Updated isApplied to true in localStorage");
            }
          }
        } catch (localStorageError) {
          console.error("Error updating localStorage:", localStorageError);
        }

        // Reset only the editable fields, keep student info
        setFormData((prev) => ({
          ...prev,
          batch: "",
          creditCompleted: "",
          creditWaived: "",
          campus: "",
          mobile: "",
          dateOfBirth: "",
          lastSemester: "",
          passingYear: "",
          sscCertificate: null,
          hscCertificate: null,
          applicationType: "0",
          remarks: "",
        }));

        const sscInput = document.getElementById(
          "sscCertificate"
        ) as HTMLInputElement;
        const hscInput = document.getElementById(
          "hscCertificate"
        ) as HTMLInputElement;
        if (sscInput) sscInput.value = "";
        if (hscInput) hscInput.value = "";

        // // Optionally redirect after success
        // setTimeout(() => {
        //   window.location.href = "/student-dashboard/status";
        // }, 2000);
        setTimeout(() => {
          window.location.href = "/student-dashboard/payment";
        }, 2000);
      } else {
        let errorMessage = "Application failed. Please try again.";

        try {
          const result = await response.json();

          if (result.errors && Array.isArray(result.errors)) {
            const serverErrors: FormErrors = {};
            result.errors.forEach((error: any) => {
              if (error.field && error.message) {
                serverErrors[error.field as keyof FormErrors] = error.message;
              }
            });
            setErrors(serverErrors);
            return;
          } else if (result.message) {
            errorMessage = result.message;
          }
        } catch (jsonError) {
          console.log(jsonError);
          switch (response.status) {
            case 400:
              errorMessage =
                "Invalid application data. Please check your inputs.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = `Application failed with status: ${response.status}`;
          }
        }

        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error("Application error:", error);

      let errorMessage =
        "Network error. Please check your connection and try again.";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to server. Please check your internet connection.";
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-medium text-gray-900">
              Submitting your application...
            </p>
            <p className="text-sm text-gray-500">Please wait</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo_all.png" alt="City University Logo" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            City University
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Certificate Application Form
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Apply for Certificate</CardTitle>
            <CardDescription>
              Enter your details below to apply for your certificate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {successMessage && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            )}

            {errors.general && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Student Information Section - Pre-filled and Disabled */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    type="text"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${
                      errors.studentId ? "border-red-500" : ""
                    }`}
                    required
                    disabled
                  />
                  {errors.studentId && (
                    <p className="text-sm text-red-500">{errors.studentId}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    type="text"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${
                      errors.studentName ? "border-red-500" : ""
                    }`}
                    required
                    disabled
                  />
                  {errors.studentName && (
                    <p className="text-sm text-red-500">{errors.studentName}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                    disabled
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="program">Program/Department *</Label>
                  <Input
                    id="program"
                    name="program"
                    type="text"
                    value={formData.program}
                    onChange={handleInputChange}
                    className={`bg-gray-100 ${
                      errors.program ? "border-red-500" : ""
                    }`}
                    required
                    disabled
                  />
                  {errors.program && (
                    <p className="text-sm text-red-500">{errors.program}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Application Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Application Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="batch">Batch *</Label>
                  <Input
                    id="batch"
                    name="batch"
                    type="text"
                    placeholder="e.g., 50"
                    value={formData.batch}
                    onChange={handleInputChange}
                    className={errors.batch ? "border-red-500" : ""}
                    required
                  />
                  {errors.batch && (
                    <p className="text-sm text-red-500">{errors.batch}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="01711112222"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={errors.mobile ? "border-red-500" : ""}
                    required
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500">{errors.mobile}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="creditCompleted">Credit Completed *</Label>
                  <Input
                    id="creditCompleted"
                    name="creditCompleted"
                    type="number"
                    placeholder="e.g., 120"
                    value={formData.creditCompleted}
                    onChange={handleInputChange}
                    className={errors.creditCompleted ? "border-red-500" : ""}
                    required
                  />
                  {errors.creditCompleted && (
                    <p className="text-sm text-red-500">
                      {errors.creditCompleted}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="creditWaived">Credit Waived *</Label>
                  <Input
                    id="creditWaived"
                    name="creditWaived"
                    type="number"
                    placeholder="e.g., 6"
                    value={formData.creditWaived}
                    onChange={handleInputChange}
                    className={errors.creditWaived ? "border-red-500" : ""}
                    required
                  />
                  {errors.creditWaived && (
                    <p className="text-sm text-red-500">
                      {errors.creditWaived}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="campus">Campus *</Label>
                <select
                  id="campus"
                  name="campus"
                  value={formData.campus}
                  onChange={handleInputChange}
                  className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.campus ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="">Select your campus</option>
                  <option value="Main Campus">Main Campus</option>
                  <option value="North Campus">North Campus</option>
                  <option value="South Campus">South Campus</option>
                  <option value="East Campus">East Campus</option>
                </select>
                {errors.campus && (
                  <p className="text-sm text-red-500">{errors.campus}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                    required
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="passingYear">Passing Year *</Label>
                  <Input
                    id="passingYear"
                    name="passingYear"
                    type="number"
                    placeholder="2025"
                    value={formData.passingYear}
                    onChange={handleInputChange}
                    className={errors.passingYear ? "border-red-500" : ""}
                    required
                  />
                  {errors.passingYear && (
                    <p className="text-sm text-red-500">{errors.passingYear}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastSemester">Last Semester *</Label>
                <select
                  id="lastSemester"
                  name="lastSemester"
                  value={formData.lastSemester}
                  onChange={handleInputChange}
                  className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.lastSemester ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="">Select your last semester</option>
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Summer 2024">Summer 2024</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2025">Spring 2025</option>
                  <option value="Summer 2025">Summer 2025</option>
                  <option value="Fall 2025">Fall 2025</option>
                </select>
                {errors.lastSemester && (
                  <p className="text-sm text-red-500">{errors.lastSemester}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="applicationType">Application Type *</Label>
                <select
                  id="applicationType"
                  name="applicationType"
                  value={formData.applicationType}
                  onChange={handleInputChange}
                  className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.applicationType ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="0">Provisional Certificate</option>
                  <option value="1">Final Certificate</option>
                  <option value="2">Transcript</option>
                </select>
                {errors.applicationType && (
                  <p className="text-sm text-red-500">
                    {errors.applicationType}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sscCertificate">SSC Certificate *</Label>
                  <div className="relative">
                    <Input
                      id="sscCertificate"
                      name="sscCertificate"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleInputChange}
                      className={`${
                        errors.sscCertificate ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {formData.sscCertificate && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {formData.sscCertificate.name}
                      </p>
                    )}
                  </div>
                  {errors.sscCertificate && (
                    <p className="text-sm text-red-500">
                      {errors.sscCertificate}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hscCertificate">HSC Certificate *</Label>
                  <div className="relative">
                    <Input
                      id="hscCertificate"
                      name="hscCertificate"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleInputChange}
                      className={`${
                        errors.hscCertificate ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {formData.hscCertificate && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {formData.hscCertificate.name}
                      </p>
                    )}
                  </div>
                  {errors.hscCertificate && (
                    <p className="text-sm text-red-500">
                      {errors.hscCertificate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <textarea
                  id="remarks"
                  name="remarks"
                  placeholder="Any additional remarks or comments..."
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
            <div className="text-center text-sm text-gray-600">
              Make sure all information is correct before submitting
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CertificateApplicationForm;

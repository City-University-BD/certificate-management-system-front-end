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
import { useState } from "react";

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
  remarks?: string;
}

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
    remarks: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Mobile validation (basic)
    const mobileRegex = /^[0-9]{11}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 11-digit mobile number";
    }

    // Credit validation (should be numbers)
    if (formData.creditCompleted && isNaN(Number(formData.creditCompleted))) {
      newErrors.creditCompleted = "Credit completed must be a number";
    }
    if (formData.creditWaived && isNaN(Number(formData.creditWaived))) {
      newErrors.creditWaived = "Credit waived must be a number";
    }

    // Passing year validation
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
      // Create payload object matching the required structure
      const payload = {
        studentId: formData.studentId,
        studentName: formData.studentName,
        program: formData.program,
        batch: formData.batch,
        creditCompleted: Number(formData.creditCompleted),
        creditWaived: Number(formData.creditWaived),
        campus: formData.campus,
        mobile: formData.mobile,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        lastSemester: formData.lastSemester,
        passingYear: Number(formData.passingYear),
        remarks: formData.remarks || "",
      };

      console.log("Submitting certificate application:", payload);

      // Simulate API call - replace with your actual endpoint
      const response = await fetch(
        "https://server-side-rho-snowy.vercel.app/application/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setSuccessMessage("Certificate application submitted successfully!");
        // Reset form
        setFormData({
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
          remarks: "",
        });
      } else {
        const result = await response.json();
        setErrors({
          studentId: result.message || "Application failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Application error:", error);
      setErrors({
        studentId: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  type="text"
                  placeholder="e.g., STU123"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className={errors.studentId ? "border-red-500" : ""}
                  required
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
                  placeholder="Enter your full name"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className={errors.studentName ? "border-red-500" : ""}
                  required
                />
                {errors.studentName && (
                  <p className="text-sm text-red-500">{errors.studentName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="program">Program *</Label>
                <select
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.program ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="">Select your program</option>
                  <option value="CSE">
                    Computer Science & Engineering (CSE)
                  </option>
                  <option value="BBA">Business Administration (BBA)</option>
                  <option value="EEE">
                    Electrical & Electronic Engineering (EEE)
                  </option>
                  <option value="CE">Civil Engineering (CE)</option>
                  <option value="ENG">English</option>
                  <option value="ECO">Economics</option>
                  <option value="MAT">Mathematics</option>
                  <option value="PHY">Physics</option>
                </select>
                {errors.program && (
                  <p className="text-sm text-red-500">{errors.program}</p>
                )}
              </div>

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
                  <p className="text-sm text-red-500">{errors.creditWaived}</p>
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

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="rahim@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
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
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting Application..." : "Submit Application"}
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

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
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  password: string;
  confirmPassword: string;
  department: string;
  image: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  studentId?: string;
  password?: string;
  confirmPassword?: string;
  department?: string;
  general?: string;
}

const Registration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    department: "",
    image: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.studentId.trim())
      newErrors.studentId = "Student ID is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
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
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        studentId: formData.studentId.trim(),
        password: formData.password,
        department: formData.department,
      };

      const response = await fetch(
        "https://server-side-rho-snowy.vercel.app/student/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
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

        setSuccessMessage("Registration successful! You can now sign in.");

        setFormData({
          name: "",
          email: "",
          phone: "",
          studentId: "",
          password: "",
          confirmPassword: "",
          department: "",
          image: null,
        });

        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        let errorMessage = "Registration failed. Please try again.";

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
                "Invalid registration data. Please check your inputs.";
              break;
            case 409:
              errorMessage =
                "An account with this email or student ID already exists.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = `Registration failed with status: ${response.status}`;
          }
        }

        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage =
        "Network error. Please check your connection and try again.";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to server. Please check your internet connection.";
      } else if (
        error instanceof SyntaxError &&
        error.message.includes("JSON")
      ) {
        errorMessage =
          "Server returned an invalid response. Please try again or contact support.";
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
              Creating your account...
            </p>
            <p className="text-sm text-gray-500">Please wait</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo_all.png" alt="City University Logo" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            City University
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Certificate Management System
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Student Account</CardTitle>
            <CardDescription>
              Enter your details below to register as a student
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

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500">
                This email must be match with your orbund email
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="01711112222"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "border-red-500" : ""}
                required
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
              <p className="text-xs text-gray-500">
                This phone number must be unique
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                name="studentId"
                type="text"
                placeholder="Enter your orbund student ID"
                value={formData.studentId}
                onChange={handleInputChange}
                className={errors.studentId ? "border-red-500" : ""}
                required
              />
              {errors.studentId && (
                <p className="text-sm text-red-500">{errors.studentId}</p>
              )}
              <p className="text-xs text-gray-500">
                Your Id must be match with orbund student ID
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department *</Label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.department ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">Select your department</option>
                <option value="Computer Science & Engineering">
                  Computer Science & Engineering
                </option>
                <option value="Business Administration">
                  Business Administration
                </option>
                <option value="Electrical & Electronic Engineering">
                  Electrical & Electronic Engineering
                </option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="English">English</option>
                <option value="Economics">Economics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Architecture">Architecture</option>
                <option value="Law">Law</option>
              </select>
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "border-red-500" : ""}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500">
                Password will be securely hashed before storage
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? "border-red-500" : ""}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Profile Image (Optional)</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="file:mr-2 file:px-2 file:py-1 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500">
                Upload a profile picture (optional)
              </p>
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
                  Creating Account...
                </>
              ) : (
                "Create Student Account"
              )}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
              >
                Sign in
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Registration;

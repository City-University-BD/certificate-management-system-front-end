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
import { useState } from "react";
import { useNavigate } from "react-router";

interface LoginData {
  email: string;
  password: string;
  role: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  role?: string;
  general?: string;
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  // Function to get the dashboard route based on role
  const getDashboardRoute = (role: string): string => {
    const roleRoutes: { [key: string]: string } = {
      account: "/accounts-dashboard",
      registrar: "/registrar-dashboard",
      faculty: "/faculty-dashboard",
      library: "/library-dashboard",
      student: "/student-dashboard",
      "exam-controller": "/exam-controller-dashboard",
    };
    return roleRoutes[role] || "/dashboard";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear specific error when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!loginData.role) {
      newErrors.role = "Please select a role";
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
        email: loginData.email.trim().toLowerCase(),
        password: loginData.password,
        // role: loginData.role,
      };

      const response = await fetch(
        `https://server-side-rho-snowy.vercel.app/${loginData.role}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const result = await response.json();
     

      if (response.ok) {
        setSuccessMessage("Login successful! Redirecting...");

        // Store authentication data if provided
        if (result) {
          localStorage.setItem("authToken", result.data.token)
        }
        if (result) {
          localStorage.setItem("userData", JSON.stringify(result.data));
        }

        // Store the user role
        localStorage.setItem("userRole", loginData.role);

        // Get the appropriate dashboard route based on role
        const dashboardRoute = getDashboardRoute(loginData.role);

        // Clear form
        setLoginData({
          email: "",
          password: "",
          role: "",
        });

        // Navigate to role-specific dashboard
        setTimeout(() => {
          navigate(dashboardRoute);
        }, 1000);
      } else {
        // Handle server errors
        if (result.errors) {
          // If server returns field-specific errors
          const serverErrors: LoginErrors = {};
          result.errors.forEach((error: any) => {
            serverErrors[error.field as keyof LoginErrors] = error.message;
          });
          setErrors(serverErrors);
        } else {
          // General error message
          setErrors({
            general:
              result.message || "Login failed. Please check your credentials.",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* System Heading */}
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
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your details below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Success Message */}
              {successMessage && (
                <div className="p-3 rounded-md bg-green-50 border border-green-200">
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              )}

              {/* General Error Message */}
              {errors.general && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={loginData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot password?(Upcoming)
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "border-red-500" : ""}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  value={loginData.role}
                  onChange={handleInputChange}
                  className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.role ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="account">Accounts</option>
                  <option value="faculty">Faculty</option>
                  <option value="library">Library</option>
                  <option value="student">Student</option>
                  <option value="registrar">Registrar</option>
                  <option value="exam-controller">Exam controller</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role}</p>
                )}
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
              {isLoading ? "Signing in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Are you student? Only student can create an account. <br />
              Don't have an account?{" "}
              <a
                href="/registration"
                className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
              >
                Sign up
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;

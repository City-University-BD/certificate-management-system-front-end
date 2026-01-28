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
import { Link, Navigate, useNavigate } from "react-router";

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
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const userData = localStorage.getItem("userData");
const userRole = localStorage.getItem("userRole");
const user = userData ? JSON.parse(userData) : null;

const navigate = useNavigate();

const roleRoutes: Record<string, string> = {
  account: "/accounts-dashboard",
  registrar: "/registrar-dashboard",
  faculty: "/faculty-dashboard",
  library: "/library-dashboard",
  student: "/student-dashboard",
  "exam-controller": "/exam-controller-dashboard",
};

if (user && userRole) {
  return <Navigate to={roleRoutes[userRole] || "/"} replace />;
}


  /* ================= ROLE WISE DEMO CREDENTIALS ================= */
  const roleCredentials: Record<string, { email: string; password: string }> = {
    "exam-controller": {
      email: "examcsece@gmail.com",
      password: "123456",
    },
    faculty: {
      email: "facultycse@gmail.com",
      password: "123456",
    },
    library: {
      email: "library@gmail.com",
      password: "123456",
    },
    account: {
      email: "account@gmail.com",
      password: "123456",
    },
    registrar: {
      email: "registrar@gmail.com",
      password: "123456",
    },
  };

  /* ================= Spinner ================= */
  const Spinner = () => (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  /* ================= Dashboard route ================= */
  const getDashboardRoute = (role: string): string => {
    const roleRoutes: Record<string, string> = {
      account: "/accounts-dashboard",
      registrar: "/registrar-dashboard",
      faculty: "/faculty-dashboard",
      library: "/library-dashboard",
      student: "/student-dashboard",
      "exam-controller": "/exam-controller-dashboard",
    };
    return roleRoutes[role] || "/dashboard";
  };

  /* ================= Input Change ================= */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // ✅ Role select করলে auto email/password বসবে
    if (name === "role") {
      const creds = roleCredentials[value];

      setLoginData((prev) => ({
        ...prev,
        role: value,
        email: creds ? creds.email : "",
        password: creds ? creds.password : "",
      }));

      setErrors({});
      return;
    }

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= Validation ================= */
  const validateForm = () => {
    const newErrors: LoginErrors = {};

    if (!loginData.email) newErrors.email = "Email is required";
    if (!loginData.password) newErrors.password = "Password is required";
    if (!loginData.role) newErrors.role = "Please select a role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= Submit ================= */
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const res = await fetch(
        `https://server-side-rho-snowy.vercel.app/${loginData.role}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginData.email.toLowerCase(),
            password: loginData.password,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage("Login successful! Redirecting...");

        if (result?.data) {
          localStorage.setItem("authToken", result.data.token);
          localStorage.setItem(
            "userData",
            JSON.stringify(result.data.user)
          );
          localStorage.setItem("signature", result.data.user.signature);
        }

        localStorage.setItem("userRole", loginData.role);

        setTimeout(() => {
          navigate(getDashboardRoute(loginData.role));
        }, 1000);
      } else {
        setErrors({ general: result.message || "Login failed" });
      }
    } catch {
      setErrors({ general: "Network error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">

        {/* ======= ORIGINAL LOGO & HEADING (UNCHANGED) ======= */}
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

        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your details below to login
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}
            {errors.general && (
              <p className="text-sm text-red-600">{errors.general}</p>
            )}

            <div>
              <Label>Email</Label>
              <Input
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <Label>Role</Label>
              <select
                name="role"
                value={loginData.role}
                onChange={handleInputChange}
                className="w-full h-9 rounded-md border px-3 text-sm"
              >
                <option value="">Select role</option>
                <option value="account">Accounts</option>
                <option value="faculty">Faculty</option>
                <option value="library">Library</option>
                <option value="student">Student</option>
                <option value="registrar">Registrar</option>
                <option value="exam-controller">Exam Controller</option>
              </select>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full flex items-center gap-2"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner /> Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
          <div className="text-center text-sm text-gray-600">
  Don’t have an account?{" "}
  <Link
    to="/registration"
    className="text-blue-600 hover:underline font-medium"
  >
    Register here
  </Link>
</div>

        </Card>
      </div>
    </div>
  );
};

export default Login;

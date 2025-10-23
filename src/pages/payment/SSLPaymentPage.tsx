import { Badge } from "@/components/ui/badge";
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
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentData {
  applicationId: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  amount: number;
  applicationType: string;
}

const SSLPaymentPage = () => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    applicationId: "",
    studentId: "",
    studentName: "",
    email: "",
    phone: "",
    amount: 0,
    applicationType: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        setLoadingData(true);

        // Get student data from localStorage
        const userData = localStorage.getItem("userData");
        if (!userData) {
          setError("No user data found. Please login again.");
          return;
        }

        const parsedData = JSON.parse(userData);
        const studentId = parsedData.studentData?.studentId;

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
          const app = result.data;

          // Determine application type label
          let appType = "";
          switch (app.applicationType) {
            case 0:
              appType = "Provisional Certificate";
              break;
            case 1:
              appType = "Final Certificate";
              break;
            case 2:
              appType = "Transcript";
              break;
            default:
              appType = "Certificate";
          }

          setPaymentData({
            applicationId: app._id,
            studentId: app.studentId,
            studentName: app.studentName,
            email: app.email,
            phone: app.mobile,
            amount: app.paymentAmount || 500, // Default amount if not set
            applicationType: appType,
          });
        } else {
          setError("No application found. Please apply first.");
        }
      } catch (err) {
        console.error("Error fetching payment info:", err);
        setError("Failed to load payment information. Please try again.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchPaymentInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const initiatePayment = async () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      window.location.href = "/student-dashboard/status";
    }, 2000);

    try {
      // Validate payment data
      if (
        !paymentData.studentName ||
        !paymentData.email ||
        !paymentData.phone
      ) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Prepare payment payload
      const paymentPayload = {
        applicationId: paymentData.applicationId,
        studentId: paymentData.studentId,
        studentName: paymentData.studentName,
        email: paymentData.email,
        phone: paymentData.phone,
        amount: paymentData.amount,
        applicationType: paymentData.applicationType,
      };

      console.log("Initiating payment with data:", paymentPayload);

      // Call your backend API to initiate SSLCommerz payment
      const response = await fetch(
        "https://server-side-rho-snowy.vercel.app/payment/init",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }

      const result = await response.json();

      // SSLCommerz returns a GatewayPageURL
      if (result.GatewayPageURL) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = result.GatewayPageURL;
      } else if (result.gatewayUrl) {
        window.location.href = result.gatewayUrl;
      } else {
        throw new Error("Payment gateway URL not found");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (error && !paymentData.studentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <Button
                onClick={() => (window.location.href = "/student-dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/logo_all.png"
              alt="City University Logo"
              className="h-16"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-2">
            Secure payment powered by SSLCommerz
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-green-600">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-sm font-medium">Secured by SSLCommerz</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Please verify your information before proceeding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      name="studentId"
                      value={paymentData.studentId}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="studentName">Full Name *</Label>
                    <Input
                      id="studentName"
                      name="studentName"
                      value={paymentData.studentName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={paymentData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={paymentData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="applicationType">Application Type</Label>
                    <Input
                      id="applicationType"
                      name="applicationType"
                      value={paymentData.applicationType}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={initiatePayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Application Type</span>
                    <span className="font-medium">
                      {paymentData.applicationType}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium">৳{paymentData.amount}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ৳{paymentData.amount}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Secure Payment</p>
                      <p className="text-blue-700">
                        Your payment is secured with 256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">
                  Accepted Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    Visa
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Mastercard
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    American Express
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    bKash
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Nagad
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Rocket
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Mobile Banking
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Internet Banking
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            By proceeding with payment, you agree to our terms and conditions.
          </p>
          <p className="mt-1">
            For payment issues, contact: support@cityuniversity.edu.bd
          </p>
        </div>
      </div>
    </div>
  );
};

export default SSLPaymentPage;

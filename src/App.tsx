import { Route, Routes } from "react-router";
import FacultyDashboard from "./dashboard/faculty_dashboard/FacultyDashboard";
import StatusCheck from "./dashboard/student_dashboard/StatusCheck";
import StudentDashboard from "./dashboard/student_dashboard/StudentDashboard";
import StudentInfo from "./dashboard/student_dashboard/StudentInfo";
import ApplicationsList from "./pages/applicaitonList/ApplicationsList";
import ApplicationDetails from "./pages/applicationDetails/ApplicationDetails";
import CertificateApplicationForm from "./pages/certificatePage/CertificateApplication";
import Login from "./pages/LoginPage/Login";
import SSLPaymentPage from "./pages/payment/SSLPaymentPage";
import Registration from "./pages/RegistrationPage/Registration";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route index element={<StudentInfo />} />
          <Route path="certificate" element={<CertificateApplicationForm />} />
          <Route path="status" element={<StatusCheck />} />
          <Route path="payment" element={<SSLPaymentPage />} />
        </Route>

        <Route
          path="/exam-controller-dashboard"
          element={<FacultyDashboard dashboard={"Exam Controller Dashboard"} />}
        >
          <Route
            index
            element={
              <ApplicationsList
                role={"examController"}
                url={"/exam-controller-dashboard"}
              />
            }
          />
          <Route
            path="application/:id"
            element={<ApplicationDetails role={"examController"} />}
          />
        </Route>

        <Route
          path="/faculty-dashboard"
          element={<FacultyDashboard dashboard={"Faculty Dashboard"} />}
        >
          <Route
            index
            element={
              <ApplicationsList role={"faculty"} url={"/faculty-dashboard"} />
            }
          />
          <Route
            path="application/:id"
            element={<ApplicationDetails role={"faculty"} />}
          />
        </Route>
        <Route
          path="/accounts-dashboard"
          element={<FacultyDashboard dashboard={"Accounts Dashboard"} />}
        >
          <Route
            index
            element={
              <ApplicationsList role={"accounts"} url={"/accounts-dashboard"} />
            }
          />
          <Route
            path="application/:id"
            element={<ApplicationDetails role={"accounts"} />}
          />
        </Route>

        <Route
          path="/library-dashboard"
          element={<FacultyDashboard dashboard={"Exam Controller Dashboard"} />}
        >
          <Route
            index
            element={
              <ApplicationsList role={"library"} url={"/library-dashboard"} />
            }
          />
          <Route
            path="application/:id"
            element={<ApplicationDetails role={"library"} />}
          />
        </Route>

        <Route path="/certificate" element={<CertificateApplicationForm />} />
      </Routes>
    </div>
  );
}

export default App;

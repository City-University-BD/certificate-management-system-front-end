import { Route, Routes } from "react-router";
import FacultyDashboard from "./dashboard/faculty_dashboard/FacultyDashboard";
import StatusCheck from "./dashboard/student_dashboard/StatusCheck";
import StudentDashboard from "./dashboard/student_dashboard/StudentDashboard";
import StudentInfo from "./dashboard/student_dashboard/StudentInfo";
import ApplicationsList from "./pages/applicaitonList/ApplicationsList";
import ApplicationDetails from "./pages/applicationDetails/ApplicationDetails";
import CertificateApplicationForm from "./pages/certificatePage/CertificateApplication";
import Login from "./pages/LoginPage/Login";
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
        </Route>
        <Route path="/faculty-dashboard" element={<FacultyDashboard />}>
          <Route index element={<ApplicationsList role={"faculty"} />} />
          <Route path="application/:id" element={<ApplicationDetails />} />
        </Route>
        <Route path="/accounts-dashboard" element={<FacultyDashboard />}>
          <Route index element={<ApplicationsList role={"accounts"} />} />
          <Route path="application/:id" element={<ApplicationDetails />} />
        </Route>
        <Route path="/exam-controller-dashboard" element={<FacultyDashboard />}>
          <Route index element={<ApplicationsList role={"examController"} />} />
          <Route path="application/:id" element={<ApplicationDetails />} />
        </Route>
        <Route path="/library-dashboard" element={<FacultyDashboard />}>
          <Route index element={<ApplicationsList role={"library"} />} />
          <Route path="application/:id" element={<ApplicationDetails />} />
        </Route>

        <Route path="/certificate" element={<CertificateApplicationForm />} />
      </Routes>
    </div>
  );
}

export default App;

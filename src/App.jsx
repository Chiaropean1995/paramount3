import HomePage from './pages/HomePage'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import AdminManagement from './pages/AdminManagement'
import LoanCalculator from './pages/LoanCalculator'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import ProjectDetail182 from "./pages/ProjectDetail182";
import MyProfile from './pages/MyProfile';
import JointVenture from './pages/JointVenture';
import './App.css'

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>

          <Routes>
            <Route path="*" element={<HomePage />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="projectdetail182" element={<ProjectDetail182 />} />
            <Route path="/loancalculator" element={<LoanCalculator />} />
            <Route path="/adminmanagement" element={<AdminManagement />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/jointventure" element={<JointVenture />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App

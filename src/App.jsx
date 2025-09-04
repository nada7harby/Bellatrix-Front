import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage/LandingPage";
import MainServices from "./components/Services/MainServices";
import About from "./pages/About";
// import HRSolution from "./pages/HrPage/HR";
import HRPage from "./pages/HrPage/HR";
import SolutionMain from "./components/solution/SolutionMain";
import Support from "./components/Support/Support";
import Manufacturing from "./pages/Industries/Manufacturing";
import Retail from "./pages/Industries/Retail";
import IndustryMain from "./components/industries/IndustryMain";
import PayrollPage from "./pages/Payroll";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="Home" element={<LandingPage />} />
        <Route path="Implementation" element={<MainServices />} />
        <Route path="Training" element={<MainServices />} />
        <Route path="netsuite-consulting" element={<MainServices />} />
        <Route path="customization" element={<MainServices />} />
        <Route path="integration" element={<MainServices />} />
        <Route path="Support" element={<MainServices />} />
        <Route path="about" element={<About />} />
        <Route path="HRSolution" element={<SolutionMain />} />
        {/* <Route path="Payroll" element={<SolutionMain />} /> */}
        {/* Add more solution routes as needed, all handled by SolutionMain */}
        {/* <Route path="/hr" element={<HRPage />} /> */}
        <Route path="/Payroll" element={<PayrollPage />} />
        <Route path="/industries/manufacturing" element={<Manufacturing />} />
        <Route path="/industries/retail" element={<Retail />} />

        {/* 
        <Route path="Support" element={<Support />} />
        <Route path="industries/manufacturing" element={<IndustryMain />} />
        <Route path="industries/retail" element={<IndustryMain />} />
        Add more industry routes as needed, all handled by IndustryMain 
        */}
      </Route>
    </Routes>
  );
}

export default App;

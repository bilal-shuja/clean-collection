import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminSignature from "./Components/AdminSignature";
import EmployeeSignature from "./Components/EmployeeSignature";
import Navbar from "./Components/Navbar";
import Signature from "./Components/Signature";

function App() {
  return (
    <div>

      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<AdminSignature />} />
          <Route path="/EmployeeSignature" element={<EmployeeSignature />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;

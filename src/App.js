// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import Dashboard from "./components/pages/Dashboard";
import ClientsPage from "./components/pages/ClientsPage";
import PaiementsPage from "./components/pages/PaiementsPage";
import ExamensPage from "./components/pages/ExamensPage";
import TopNavbar from "./components/TopNavbar";
import { ActiveLinkProvider } from "./components/context/ActiveLinkContext";

function App() {
  return (
    <ActiveLinkProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<WithNavbar><Dashboard /></WithNavbar>} />
          <Route path="/clients" element={<WithNavbar><ClientsPage /></WithNavbar>} />
          <Route path="/paiements" element={<WithNavbar><PaiementsPage /></WithNavbar>} />
          <Route path="/examens" element={<WithNavbar><ExamensPage /></WithNavbar>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ActiveLinkProvider>
  );
}

const WithNavbar = ({ children }) => (
  <>
    <TopNavbar />
    <div style={{ padding: '20px' }}>{children}</div>
  </>
);

export default App;

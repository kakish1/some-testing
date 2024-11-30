import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Register, ProtectedRoute } from "./components";
import { AuthProvider } from "./context/AuthContext";
import MainPage from "./pages/MainPage";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<>123</>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <DataProvider>
                    <MainPage />
                  </DataProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        setUser({ token, role: userData.role });
      } catch (error) {
        console.error("Ошибка при обработке токена", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    const userData = JSON.parse(atob(token.split(".")[1]));
    setUser({ token, role: userData.role });
    localStorage.setItem("token", token);
    navigate("/main");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("laundryUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginUser = (data) => {
    localStorage.setItem("laundryUser", JSON.stringify(data));
    localStorage.setItem("laundryToken", data.token);
    setUser(data);
  };

  const logoutUser = () => {
    localStorage.removeItem("laundryUser");
    localStorage.removeItem("laundryToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
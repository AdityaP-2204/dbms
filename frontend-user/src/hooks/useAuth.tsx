import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;   
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("http://localhost:8080/api/auth/validate");
        setUser(res.data);
      } catch {
        // console.log("ya hora hai ye")
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return user;
}

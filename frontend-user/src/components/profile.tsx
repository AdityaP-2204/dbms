import { useEffect, useState } from "react";
export default function Profile(){
    const [userId, setUserId] = useState<string | null>(null);
      useEffect(() => {
        const storedId = localStorage.getItem("id");
        setUserId(storedId);
      }, []);

      return(
        <div className="pt-20">
            Profile to be updated
        </div>
      )
}
import { useState, useEffect } from "react";
import axios from "axios";
import { Coach } from "../interfaces/Coach";

const useAssignedCoach = () => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignedCoach = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ coach: Coach }>(
          "http://localhost:5000/collab/client/assigned-coach",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCoach(response.data.coach);
        setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch assigned coach"
        );
        setCoach(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCoach();
  }, []);

  return { coach, loading, error };
};

export default useAssignedCoach;

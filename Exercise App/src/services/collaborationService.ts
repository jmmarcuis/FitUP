import api from "./api";
import { CoachCollab } from "../Types/Collab";

const API_BASE_URL = "http://localhost:5000/collab";

export const getCollaborationByClient = async (): Promise<CoachCollab | null> => {
    try {
        const response = await api.get(`${API_BASE_URL}/client/active-coach`);

        if (response.status === 200 && response.data.coach) {
            return response.data.coach;
        }

        console.warn("No active coach found");
        return null;
    } catch (error) {
        console.error("Error fetching coach collaboration:", error);
        return null;
    }
};


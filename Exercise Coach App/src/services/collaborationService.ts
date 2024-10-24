import api from "./api";
import { ClientCollab } from "../Types/Collab";

const API_BASE_URL = "http://localhost:5000/collab";

export const getClientCollabotion = async (): Promise<ClientCollab | null> => {
  try {
    const response = await api.get(`${API_BASE_URL}/coach/active-clients`);

    if (response.status === 200 && response.data.activeClients.length > 0) {
      return response.data.activeClients[0];
    }

    console.warn("No active clients found");
    return null;
  } catch (error) {
    console.error("Error fetching clients collaboration:", error);
    return null;
  }
};

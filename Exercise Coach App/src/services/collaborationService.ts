// collaborationService.ts
import api from "./api";
import { ClientCollab } from "../Types/Collab";

const API_BASE_URL = "http://localhost:5000/collab";

export interface ActiveClient {
  collaborationId: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  clientImage: string;
  startDate: string;
}

export const getActiveClients = async (): Promise<ActiveClient[]> => {
  try {
    const response = await api.get(`${API_BASE_URL}/coach/active-clients`);
    if (response.status === 200) {
      return response.data.activeClients || [];
    }
    console.warn("No active clients found");
    return [];
  } catch (error) {
    console.error("Error fetching active clients:", error);
    return [];
  }
};

export const getClientCollaboration = async (): Promise<ClientCollab | null> => {
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

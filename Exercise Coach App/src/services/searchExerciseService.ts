import api from "./api";
const API_BASE_URL = "http://localhost:5000";

export const searchExercises = async (term: string, token: string) => {
  try {
    const response = await api.get(`${API_BASE_URL}/exercise/search`, {
      params: { name: term },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching exercises:', error);
    throw error;
  }
};
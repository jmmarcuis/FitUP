import api from "./api";
import { Message } from "../Types/Message";

const API_BASE_URL = "http://localhost:5000/message";

export const getCollaborationMessages = async (
    collaborationId: string
): Promise<Message[] | null> => {
    try {
        const response = await api.get(
            `${API_BASE_URL}/collaborations/${collaborationId}/messages`
        );

        if (response.status === 200 && Array.isArray(response.data)) {
            return response.data;
        }

        console.warn("No messages found");
        return null;
    } catch (error) {
        console.error("Error fetching collaboration messages:", error);
        return null;
    }
};

export const saveMessage = async (
  content: string,
  collaborationId: string
): Promise<Message | null> => {
  const token = localStorage.getItem('token'); // Ensure token is stored

  if (!token) {
    alert('Your login token has expired. Please log in to continue.');
    return null;
  }

  try {
    const response = await api.post(
      `${API_BASE_URL}/messages`, // Ensure the URL matches the backend route
      { content, collaborationId: collaborationId }
    );

    console.log('Message saved:', response.data ); // Debugging log
    return response.data; // Return the saved message
  } catch (error) {
    console.error('Error sending message:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

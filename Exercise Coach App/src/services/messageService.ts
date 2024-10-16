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

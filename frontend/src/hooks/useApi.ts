import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const useApi = () => {
  const { getToken } = useAuth();

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();
    console.log("Clerk token being sent:", token);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }

    return response.json();
  };

  return {
    // User endpoints
    getUserProfile: () => apiCall('/user/profile'),
    getEnrolledEvents: () => apiCall('/user/enrolled-events'),
    enrollInEvent: (eventId: string) => apiCall(`/user/enroll/${eventId}`, { method: 'POST' }),
    unenrollFromEvent: (eventId: string) => apiCall(`/user/enroll/${eventId}`, { method: 'DELETE' }),
    getEnrollmentStatus: (eventId: string) => apiCall(`/user/enrollment-status/${eventId}`),

    // Event endpoints (public)
    getEvents: () => apiCall('/event'),
    getEvent: (eventId: string) => apiCall(`/event/${eventId}`),
    createEvent: (eventData: any) => apiCall('/event/new', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
    updateEvent: (eventId: string, eventData: any) => apiCall(`/event/edit/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),
    deleteEvent: (eventId: string) => apiCall(`/event/delete/${eventId}`, { method: 'DELETE' }),
    getEventEnrollments: (eventId: string) => apiCall(`/event/${eventId}/enrollments`),
    getEventStats: (eventId: string) => apiCall(`/event/${eventId}/stats`),

    // Comment endpoints
    getEventComments: (eventId: string) => apiCall(`/comment/event/${eventId}`),
    getUserComments: (userId: string) => apiCall(`/comment/user/${userId}`),
    createComment: (commentData: { content: string; eventId: string }) => apiCall('/comment/new', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),
    updateComment: (commentId: string, content: string) => apiCall(`/comment/edit/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
    deleteComment: (commentId: string) => apiCall(`/comment/delete/${commentId}`, { method: 'DELETE' }),
  };
};
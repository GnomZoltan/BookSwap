import axiosInstance from './axiosInstance';

export const getOrCreateConversation = (bookId: string, otherUserId: string) =>
  axiosInstance.get(`/chat/conversation/${bookId}/${otherUserId}`);

export const getUserConversations = () =>
  axiosInstance.get('/chat/conversations');

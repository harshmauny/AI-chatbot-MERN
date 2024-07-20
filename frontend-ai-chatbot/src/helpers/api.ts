import axios from "axios";
import { LoginData, SignupData } from "../context/AuthContext";

export const loginUser = async (loginData: LoginData) => {
  const response = await axios.post("/user/login", loginData);
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  return await response.data;
};

export const createNewChat = async () => {
  const response = await axios.post("/chat/new-chat");
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  return await response.data;
};

export const checkAuthStatus = async () => {
  const response = await axios.get("/user/auth-status");
  if (response.status !== 200) {
    throw new Error(response.data.message);
  }
  return await response.data;
};

export const sendChatRequest = async (message: string, id: string | null) => {
  const res = await axios.post("/chat/chat-completion", { message, id });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async (id: string | null) => {
  const res = await axios.delete(`/chat/delete/${id}`);
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (signupData: SignupData) => {
  const res = await axios.post("/user/signup", signupData);
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

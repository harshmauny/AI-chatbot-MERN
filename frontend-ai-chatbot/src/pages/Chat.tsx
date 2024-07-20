import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserChats } from "../helpers/api";
import toast from "react-hot-toast";
import ChatPannelComponent from "../components/chat/ChatPannelComponent";
import SideBar from "../components/chat/SideBar";
export type Conversation = {
  role: "USER" | "CHATBOT";
  content: string;
};

export type Message = {
  _id: string;
  chatName: string;
  date: string;
  conversation: Conversation[];
};
const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          const sortedChats = [...data.chats].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          setChatMessages(sortedChats);
          setCurrentChatId(sortedChats[0]._id);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);
  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  }, [auth]);
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <SideBar
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        open={open}
        setOpen={setOpen}
      />
      <ChatPannelComponent
        currentChatId={currentChatId}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        sidebarOpen={open}
        setOpen={setOpen}
      />
    </Box>
  );
};

export default Chat;

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { deleteUserChats, getUserChats } from "../helpers/api";
import toast from "react-hot-toast";
import ChatPannelComponent from "../components/chat/ChatPannelComponent";
import SideBar from "../components/chat/SideBar";
export type Message = {
  role: "user" | "assistant";
  content: string;
};
const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [open, setOpen] = React.useState(false);
  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
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
        setChatMessages={setChatMessages}
        open={open}
        setOpen={setOpen}
      />
      <ChatPannelComponent
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        sidebarOpen={open}
        setOpen={setOpen}
      />
    </Box>
  );
};

export default Chat;

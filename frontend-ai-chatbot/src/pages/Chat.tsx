import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api";
import toast from "react-hot-toast";
type Message = {
  role: "user" | "assistant";
  content: string;
};
const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
    //
  };
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };
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
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          width: "260px",
          flexShrink: 0,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100vh",
            bgcolor: "#171717",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ mx: "auto", fontFamily: "work sans", mt: 3 }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography
            sx={{
              mx: "auto",
              fontFamily: "work sans",
              my: 2,
              p: 3,
              flex: "1 1 0%",
              overflowY: "auto",
            }}
          >
            You can ask some questions related to Knowledge, Business, Advices,
            Education, etc. But avoid sharing personal information
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              py: 2,
            }}
          >
            <Button
              onClick={handleDeleteChats}
              sx={{
                width: "200px",
                color: "white",
                fontWeight: "700",
                borderRadius: 3,
                mx: "auto",
                bgcolor: red[300],
                ":hover": {
                  bgcolor: red.A400,
                },
              }}
            >
              Clear Conversation
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 1, xs: 1, sm: 1 },
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            px: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              color: "#b4b4b4",
              fontWeight: "600",
            }}
          >
            Model - GPT 3.5 Turbo
          </Typography>
          <>
            <Avatar
              sx={{
                my: 2,
                bgcolor: "white",
                color: "black",
                fontWeight: 600,
                fontSize: "16px",
              }}
              component={Typography}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              {auth?.user?.first_name[0]?.toUpperCase()}
              {auth?.user?.last_name[0]?.toUpperCase()}
            </Avatar>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{
                "& .MuiPaper-root": {
                  backgroundColor: "#2f2f2f",
                  color: "white",
                  borderColor: "hsla(0,0%,100%,.1) !important",
                },
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={auth?.logout}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: "white" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100vh",
            flex: "1 1 0%",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.length > 0 &&
            chatMessages.map((chat, index) => (
              //@ts-ignore
              <ChatItem content={chat.content} role={chat.role} key={index} />
            ))}
          {chatMessages.length <= 0 && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="chatgpt_logo_white.png"
                alt=""
                width={"50px"}
                height={"50px"}
                className="image-inverted"
              />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: "#2f2f2f",
            display: "flex",
            m: "20px",
            borderRadius: "26px",
          }}
        >
          <div
            style={{
              width: "100%",
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              flex: "1 1 0%",
              paddingLeft: "10px",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              style={{
                width: "100%",
                backgroundColor: "#2f2f2f",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "15px",
              }}
            />
          </div>
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;

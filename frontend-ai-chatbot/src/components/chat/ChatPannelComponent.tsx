import React, { useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  styled,
} from "@mui/material";
import { IoMdSend } from "react-icons/io";
import Logout from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import { Message } from "../../pages/Chat";
import ChatItem from "../../components/chat/ChatItem";
import { sendChatRequest } from "../../helpers/api";
import MenuIcon from "@mui/icons-material/Menu";

type ChatPannelComponentProps = {
  chatMessages: Message[];
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sidebarOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const drawerWidth = 280;

const Main = styled("div", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const ChatPannelComponent = ({
  chatMessages,
  setChatMessages,
  sidebarOpen,
  setOpen,
}: ChatPannelComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    scrollToBottom();
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);

    scrollToBottom();
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Main open={sidebarOpen}>
      <Box
        sx={{
          display: "flex",
          flex: { md: 1, xs: 1, sm: 1 },
          flexDirection: "column",
          position: "relative",
          overflowY: "auto",
        }}
      >
        <Box sx={{ position: "relative", overflowY: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 10,
              px: 2,
              position: "sticky",
              top: 0,
              backgroundColor: "#212121",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!sidebarOpen && (
                <IconButton
                  onClick={handleDrawerOpen}
                  sx={{ color: "white", mx: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#b4b4b4",
                  fontWeight: "600",
                }}
              >
                Model - GPT 3.5 Turbo
              </Typography>
            </Box>
            <>
              <Avatar
                sx={{
                  my: 2,
                  bgcolor: "white",
                  color: "black",
                  fontWeight: 600,
                  fontSize: "14px",
                  width: "30px",
                  height: "30px",
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
              height: "78vh",
              flex: "1 1 0%",
              borderRadius: 3,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              maxWidth: "700px",
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
            <div ref={messagesEndRef} />
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "#212121",
            position: "sticky",
            bottom: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              m: "20px",
              width: "100%",
              maxWidth: "700px",
              bgcolor: "#2f2f2f",
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
                paddingLeft: "15px",
              }}
            >
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
              </form>
            </div>
            <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
              <IoMdSend />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Main>
  );
};

export default ChatPannelComponent;

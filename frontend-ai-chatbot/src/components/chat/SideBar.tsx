import React from "react";
import {
  Box,
  Button,
  IconButton,
  Drawer,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import toast from "react-hot-toast";
import { createNewChat, deleteUserChats } from "../../helpers/api";
import { Message } from "../../pages/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

type SideBarProps = {
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatMessages: Message[];
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
};
const SideBar = ({
  setChatMessages,
  open,
  setOpen,
  currentChatId,
  chatMessages,
  setCurrentChatId,
}: SideBarProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      const res = await deleteUserChats(currentChatId);

      const updatedChats = [...chatMessages].filter((chat) => {
        return chat._id !== currentChatId;
      });
      if (updatedChats.length === 0) {
        const response = await createNewChat();
        setChatMessages(response.chats);
        setCurrentChatId(response.chatId);
      } else {
        setChatMessages(updatedChats);
        setCurrentChatId(updatedChats[0]._id);
      }
      handleClose();
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };
  const handleNewChat = async () => {
    try {
      toast.loading("Creating New Chat", { id: "newchat" });
      const res = await createNewChat();
      const sortedChats = [...res.chats].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setChatMessages(sortedChats);
      setCurrentChatId(res.chatId);
      toast.success("Chat Created Successfully", { id: "newchat" });
    } catch (error) {
      console.log(error);
      toast.error("Creating new chat failed", { id: "newchat" });
    }
  };
  return (
    <Drawer
      open={open}
      onClose={handleDrawerClose}
      variant="persistent"
      sx={{
        width: 280,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          border: "none",
        },
      }}
      anchor="left"
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
          <Box
            sx={{ display: "flex", justifyContent: "space-between", m: 1.5 }}
          >
            <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
            <IconButton onClick={handleNewChat} sx={{ color: "white" }}>
              <AddIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0%",
              width: "100%",
              overflowY: "auto",
            }}
          >
            {chatMessages &&
              chatMessages.map((chat) => (
                <Button
                  key={chat._id}
                  id="chat-id-button"
                  sx={{
                    mx: "auto",
                    width: "90%",
                    fontFamily: "work sans",
                    gap: 2,
                    px: 2,
                    borderRadius: 3,
                    color: "white",
                    backgroundColor:
                      chat._id === currentChatId ? "#212121" : "",
                    ":hover": {
                      backgroundColor: "#212121",
                    },
                    position: "relative",
                  }}
                  disableRipple
                  onClick={() => setCurrentChatId(chat._id)}
                >
                  <div
                    style={{
                      width: "100%",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      display: "flex",
                      justifyContent: "left",
                      textTransform: "none",
                    }}
                  >
                    {chat.chatName}
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                      position: "absolute",
                      right: 8,
                      width: "45px",
                      visibility:
                        chat._id === currentChatId ? "visible" : "hidden",
                      background:
                        "linear-gradient(to left, #212121 60%, transparent )",
                      "#chat-id-button:hover & ": {
                        visibility: "visible",
                      },
                    }}
                  >
                    <Button
                      id="basic-button"
                      aria-controls={openMenu ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? "true" : undefined}
                      onClick={handleClick}
                      disableRipple
                      sx={{
                        justifyContent: "end",
                        color: "white",
                        ":hover": {
                          bgcolor: "transparent",
                        },
                        "&:focus": {
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      <MoreHorizIcon />
                    </Button>
                  </Box>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    sx={{
                      "& .MuiMenu-paper": {
                        backgroundColor: "#2f2f2f",
                        borderRadius: 3,
                        "& :after": {
                          border: "0 solid #e3e3e3",
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleDeleteChats}
                      disableRipple
                      sx={{
                        mx: "12px",
                        ":hover": {
                          bgcolor: "#424242",

                          borderRadius: 3,
                        },
                      }}
                    >
                      <ListItemIcon>
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#db4c42" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          "& .MuiTypography-root": {
                            color: "#db4c42 !important",
                          },
                        }}
                      >
                        Delete
                      </ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      disableRipple
                      sx={{
                        mx: "12px",
                        ":hover": {
                          bgcolor: "#424242",

                          borderRadius: 3,
                        },
                      }}
                    >
                      <ListItemIcon>
                        <DriveFileRenameOutlineIcon
                          fontSize="small"
                          sx={{ color: "#db4c42" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          "& .MuiTypography-root": {
                            color: "white",
                          },
                        }}
                      >
                        Rename
                      </ListItemText>
                    </MenuItem>
                  </Menu>
                </Button>
              ))}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideBar;

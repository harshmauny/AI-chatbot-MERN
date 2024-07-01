import React from "react";
import { Box, Typography, Button, IconButton, Drawer } from "@mui/material";
import toast from "react-hot-toast";
import { deleteUserChats } from "../../helpers/api";
import { Message } from "../../pages/Chat";
import MenuIcon from "@mui/icons-material/Menu";

type SideBarProps = {
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const SideBar = ({ setChatMessages, open, setOpen }: SideBarProps) => {
  const handleDrawerClose = () => {
    setOpen(false);
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
          </Box>
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
                bgcolor: "#10a37f",
                ":hover": {
                  bgcolor: "#10a37f",
                },
              }}
            >
              Clear Conversation
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideBar;

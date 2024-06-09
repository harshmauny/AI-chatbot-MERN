import react from "react";
import Logo from "./shared/Logo";
import { AppBar, Toolbar } from "@mui/material";

const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "transparent", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Logo />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

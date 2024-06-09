import react from "react";
import Logo from "./shared/Logo";
import { AppBar, Toolbar } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

const Header = () => {
  const auth = useAuth();
  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "transparent", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Logo />
        {auth?.isLoggedIn ? (
          <>
            <NavigationLink
              to="/chat"
              bg="#10a37f"
              text="Chat"
              textColor="black"
            />
            <NavigationLink
              to="/"
              bg="#51538f"
              text="Logout"
              textColor="white"
              onClick={auth.logout}
            />
          </>
        ) : (
          <>
            <NavigationLink
              to="/login"
              bg="#10a37f"
              text="Login"
              textColor="black"
            />
            <NavigationLink
              to="/signup"
              bg="#51538f"
              text="Sign Up"
              textColor="black"
            />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { CircularProgress } from "@mui/material";
import { useAuth } from "./context/AuthContext";

function App() {
  const auth = useAuth();
  if (auth?.loading)
    return (
      <main>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="inherit" />
        </div>
      </main>
    );

  return (
    <main>
      <Routes>
        <Route path="/" element={auth?.isLoggedIn ? <Chat /> : <Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;

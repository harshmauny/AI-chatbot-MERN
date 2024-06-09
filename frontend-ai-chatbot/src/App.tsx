import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();
  return (
    <main>
      {location.pathname === "/chat" ||
        (location.pathname === "/" && <Header />)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;

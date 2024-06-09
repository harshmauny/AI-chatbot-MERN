import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
export default function Logo() {
  return (
    <div
      style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Link to="/">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="chatgpt_logo_white.png"
            alt=""
            width={"30px"}
            height={"30px"}
            className="image-inverted"
          />

          <Typography
            sx={{
              display: { md: "block", sm: "none", xs: "none" },
              mr: "auto",
              fontWeight: "800",
              textShadow: "2px 2px 20px #000",
            }}
          >
            <span style={{ fontSize: "20px" }}>MERN</span>-GPT
          </Typography>
        </div>
      </Link>
    </div>
  );
}

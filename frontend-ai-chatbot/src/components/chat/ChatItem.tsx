import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks;
  }
}

function isCodeBlock(str: string) {
  if (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("[") ||
    str.includes("]") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("#") ||
    str.includes("//")
  ) {
    return true;
  }
  return false;
}
const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "USER" | "CHATBOT";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();
  return role == "CHATBOT" ? (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        justifyContent: "flex-start",
        fontSize: "16px",
      }}
    >
      <Box
        sx={{
          maxWidth: "90%",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div
          style={{
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "flex-start",
            outline: "solid 1px #424242",

            padding: "4px",
          }}
        >
          <img
            src="chatgpt_logo_white.png"
            alt=""
            width={"26px"}
            height={"26px"}
            className="image-inverted"
          />
        </div>
        <Box>
          {!messageBlocks && (
            <Typography
              sx={{
                fontSize: "14px",
                borderRadius: "1.5rem",
                p: "10px 16px",
                color: "#ececec",
              }}
            >
              {content}
            </Typography>
          )}
          {messageBlocks &&
            messageBlocks.length &&
            messageBlocks.map((block) =>
              isCodeBlock(block) ? (
                <SyntaxHighlighter style={coldarkDark} language="javascript">
                  {block}
                </SyntaxHighlighter>
              ) : (
                <Typography sx={{ fontSize: "14px" }}>{block}</Typography>
              ),
            )}
        </Box>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        justifyContent: "flex-end",
        fontSize: "16px",
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          {!messageBlocks && (
            <Typography
              sx={{
                fontSize: "14px",
                bgcolor: "#2f2f2f",
                borderRadius: "1.5rem",
                p: "10px 16px",
                color: "#ececec",
              }}
            >
              {content}
            </Typography>
          )}
          {messageBlocks &&
            messageBlocks.length &&
            messageBlocks.map((block) =>
              isCodeBlock(block) ? (
                <SyntaxHighlighter style={coldarkDark} language="javascript">
                  {block}
                </SyntaxHighlighter>
              ) : (
                <Typography sx={{ fontSize: "14px" }}>{block}</Typography>
              ),
            )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatItem;

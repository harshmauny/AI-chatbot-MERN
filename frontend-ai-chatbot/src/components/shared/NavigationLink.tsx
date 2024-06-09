import React from "react";
import { Link } from "react-router-dom";
import "./NavigationLink.css";

type NavigationLinkProps = {
  to: string;
  bg: string;
  text: string;
  textColor: string;
  onClick?: () => Promise<void>;
};

export default function NavigationLink(props: NavigationLinkProps) {
  const { to, bg, text, textColor, onClick = () => {} } = props;
  return (
    <Link
      className="nav-link"
      to={to}
      style={{ backgroundColor: bg, color: textColor }}
      onClick={onClick}
    >
      {text}
    </Link>
  );
}

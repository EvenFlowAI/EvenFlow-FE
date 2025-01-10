import React from "react";
import { styled } from "@mui/material";

export const ConsultantWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  display: "grid",
  gap: 16,
  gridTemplateColumns: "1fr 1fr",
  border: `1px solid ${active ? "#000000" : "#DADADA"}`,
  color: active ? "#FFFFFF" : theme.palette.text.primary,
  background: active ? "#000000" : "transparent",
  alignItems: "center",
  fontSize: 18,
  fontWeight: 400,
  lineHeight: "18px",
  padding: "8px 12px",
  transition: "all .2s",
  cursor: "pointer",
  "& .icon-wrapper": {
    width: 80,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: active ? "#FFFFFF" : theme.palette.text.primary,
  },
}));

export const Avatar = styled("div", {
  shouldForwardProp: (prop) => prop !== "src" && prop !== "contain",
})<{ src?: string; contain?: boolean }>(({ src, contain }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  backgroundColor: "#FFFFFF",
  backgroundSize: contain ? "contain" : "cover",
  backgroundImage: src ? `url('${src}')` : undefined,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}));

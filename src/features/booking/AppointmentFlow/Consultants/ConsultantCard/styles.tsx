import React from 'react';
import {styled} from "@mui/material";

export const ConsultantWrapper = styled("div")<{ active?: boolean }>(({theme, active}) => ({
    display: 'grid',
    gap: 16,
    gridTemplateColumns: '1fr 1fr',
    border: `1px solid ${active ? "#000000" : "#DADADA"}`,
    color: active ? "#FFFFFF" : theme.palette.text.primary,
    background: active ? "#000000" : "transparent",
    alignItems: "center",
    fontSize: 18,
    fontWeight:400,
    lineHeight:"18px",
    padding:16,
    transition:"all .2s",
    cursor:"pointer",
    "& .icon-wrapper":
{
    width: 84,
        display:"flex",
    alignItems:"center",
    justifyContent:'center',
    height:84,
    borderRadius:"50%",
    color:active ? "#FFFFFF" : theme.palette.text.primary,
}}));

export const Avatar = styled('div')<{ src?: string, contain?: boolean }>(({ src, contain }) => ({
    width: 84,
    height: 84,
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    backgroundSize: contain ? "contain" : "cover",
    backgroundImage: src ? `url('${src}')` : undefined,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
}));
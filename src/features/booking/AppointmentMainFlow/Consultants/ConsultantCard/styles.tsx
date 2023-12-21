import React from 'rect';
import {styled, Theme} from "@material-ui/core";

export const ConsultantWrapper = styled(({active, ...props}) => (<div {...props}/>))<Theme, { active?: boolean }>(({theme, active}) => ({
    display: 'grid',
    gridGap: 16,
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

export const Avatar = styled('div')<Theme, { src?: string, contain?: boolean }>({
    width: 84,
    height: 84,
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    backgroundSize: ({contain}) => contain ? "contain" : "cover",
    backgroundImage: ({src}) => src ? `url('${src}')` : undefined,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
});
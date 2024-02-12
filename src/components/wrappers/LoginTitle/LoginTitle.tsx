import React from "react";
import {Typography} from "@mui/material";

type Props = {title: string};

export const LoginTitle: React.FC<React.PropsWithChildren<React.PropsWithChildren<Props>>> = ({title}) => {
    return <Typography variant="h1" style={{
        textTransform: "uppercase", textAlign: "center",
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 40
    }}>{title}</Typography>;
}

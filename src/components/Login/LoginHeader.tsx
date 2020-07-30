import React from "react";
import {Typography} from "@material-ui/core";

type Props = {title: string};

export const LoginHeader: React.FC<Props> = ({title}) => {
    return <Typography variant="h1" style={{
        textTransform: "uppercase", textAlign: "center",
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 40
    }}>{title}</Typography>;
}

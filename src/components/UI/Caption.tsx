import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import {InfoOutlined} from "@material-ui/icons";

const useStyles = makeStyles({
    caption: {
        display: "flex",
        fontSize: 16,
        marginTop: 10,
        alignItems: "center",
        "& .MuiSvgIcon-root": {
            marginRight: 8
        }
    }
});
export const Caption: React.FC<{title: string|JSX.Element, icon?: JSX.Element}> = ({title, icon}) => {
    const classes = useStyles();
    return <div className={classes.caption}>
        {icon ? icon : <InfoOutlined color="primary" style={{ marginRight: 8 }}/>}
        <span>{title}</span>
    </div>
}
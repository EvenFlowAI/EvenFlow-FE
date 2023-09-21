import {makeStyles} from "@material-ui/core/styles";
import React, {ReactComponentElement} from "react";

const useStyles = makeStyles({
    wrapper: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: 'center',
        marginBottom: 24,
    },
    icon: {
        marginRight: 32
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        color: "#252733",
        fontSize: 14,
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        color: "#858585",
        fontSize: 14,
    }
})

const DetailsItem: React.FC<{title: string, text: string|string[], icon?: ReactComponentElement<any>}> = ({title, text, icon}) => {
    const classes = useStyles();
    return text?.length
        ? <div className={classes.wrapper}>
            {icon ? <div className={classes.icon}>{icon}</div> : null}
            <div className={classes.details}>
                <div className={classes.title}>{title}</div>
                <div className={classes.text}>
                    {typeof text === 'string' ? text : text.map(item => <div>{item}</div>)}
                </div>
            </div>
        </div>
        : null
}

export default DetailsItem;
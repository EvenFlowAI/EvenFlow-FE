import React, {useState} from 'react';
import {Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import bg from "../../assets/img/welcomeBg.jpg";
import {CustomerSelect} from "./CustomerSelect";
import { LoginInput } from './LoginInput';
import { useHistory } from 'react-router-dom';
import {Routes} from "../../config/routes";

const useStyles = makeStyles({
    container: {
        width: "100vw",
        minHeight: "100vh",
        padding: "50px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url('${bg}') top center no-repeat`,
        backgroundSize: "cover"
    },
    title: {
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 32,
        margin: 0,
        textAlign: "center",
    },
    paper: {
        borderRadius: 4,
        maxWidth: 990,
        width: "70%",
        padding: 48,
        backgroundColor: "rgba(255,255,255,.8)"
    }
})

export const Welcome = () => {
    const [isSelect, setSelect] = useState<boolean>(false);
    const history = useHistory();

    const toggleSelect = (b?: boolean) => {
        setSelect(b !== undefined ? b : !isSelect);
    }
    const onComplete = () => {
        history.push(Routes.EndUser.Appointment);
    }
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Paper className={classes.paper} variant="outlined" >
                <h1 className={classes.title}>Welcome!</h1>
                <h2 className={classes.title}>Schedule Your Service:</h2>
                {!isSelect
                    ? <CustomerSelect onSelect={toggleSelect} onComplete={onComplete}/>
                    : <LoginInput onSelect={toggleSelect} onComplete={onComplete} />
                }
            </Paper>
        </div>
    );
};
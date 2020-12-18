import React, {useState} from 'react';
import {Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import bg from "../../assets/img/welcomeBg.jpg";
import {CustomerSelect} from "./CustomerSelect";
import { LoginInput } from './LoginInput';
import { useHistory } from 'react-router-dom';
import {Routes} from "../../config/routes";
import {useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";

const mh400 = "@media (max-height: 400px)";
const mh600 = "@media (max-height: 600px)";

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100vw",
        minHeight: 0,
        padding: "5% 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url('${bg}') top center no-repeat`,
        backgroundSize: "cover",
        flex: 1,
        [mh600]: {
            padding: "2% 0"
        },
        [theme.breakpoints.down("sm")]: {
            padding: 0
        }
    },
    title: {
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 32,
        margin: 0,
        textAlign: "center",
        [mh600]: {
            fontSize: 22
        },
        [mh400]: {
            fontSize: 18
        },
        [theme.breakpoints.down("sm")]: {
            fontSize: 18,
        }
    },
    paper: {
        borderRadius: 4,
        maxWidth: 990,
        width: "70%",
        maxHeight: "100%",
        overflowY: "auto",
        padding: "5%",
        backgroundColor: "rgba(255,255,255,.8)",
        [mh600]: {
            padding: "2%"
        },
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            height: "100%",
            paddingTop: theme.spacing(6)
        }
    }
}))

export const Welcome = () => {
    const [isSelect, setSelect] = useState<boolean>(false);
    const history = useHistory();
    const scProfile = useSelector((state: RootState) => state.appointment.scProfile);

    const toggleSelect = (b?: boolean) => {
        setSelect(b !== undefined ? b : !isSelect);
    }
    const onComplete = () => {
        history.push(
            Routes.EndUser.Appointment.replace(":id", scProfile?.id ? String(scProfile.id) : "0")
        );
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
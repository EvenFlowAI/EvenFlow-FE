import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper, useMediaQuery, useTheme} from "@material-ui/core";
import {TextField} from "../UI/EndUserInputs";
import {useDispatch, useSelector} from "react-redux";
import {setCustomerEnteredEmail, setCustomerLoadedData} from "../../store/reducers/appointment/actions";
import {RootState} from "../../store/rootReducer";
import {API} from "../../api/api";
import {useParams} from "react-router-dom";
import {LoadingButton} from "../UI/Button";

const mh600 = "@media (max-height: 600px)";

const useStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: 2,
        marginTop: "5%",
        padding: "42px 20%",
        [mh600]: {
            padding: "20px 20%",
            marginTop: "2%",
        },
        [theme.breakpoints.down("xs")]: {
            minHeight: "calc(90% - 26px)",
            display: "flex",
            flexFlow: "column nowrap"
        }
    },
    button: {
        minWidth: 144,
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            "&:last-child": {
                order: -1,
                marginBottom: theme.spacing(2)
            }
        }
    },
    title: {
        fontSize: 32,
        margin: "0 0 10px",
        fontWeight: "bold",
        textAlign: "center",
        [mh600]: {
            fontSize: 22
        },
        [theme.breakpoints.down("xs")]: {
            fontSize: 18
        }
    },
    buttonsRow: {
        marginTop: "8%",
        display: "flex",
        justifyContent: "space-around",
        flexFlow: "row nowrap",
        [mh600]: {
            marginTop: "4%"
        },
        [theme.breakpoints.down("xs")]: {
            flexWrap: "wrap"
        }
    }
}));

type TProps = {
    onSelect: (b?: boolean) => void,
    onComplete: () => void
}
export const LoginInput: React.FC<TProps> = ({onSelect, onComplete}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles();
    const {id: serviceCenterId} = useParams();
    const dispatch = useDispatch();
    const customerEnteredEmail = useSelector((state: RootState) => state.appointment.customerEnteredEmail);
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        dispatch(setCustomerEnteredEmail(value));
    }
    const handleComplete = async () => {
        setLoading(true);
        try {
            const {data} = await API.appointment.searchCustomer({
                serviceCenterId,
                searchTerm: customerEnteredEmail
            });
            dispatch(setCustomerLoadedData(data));
        } catch {
            dispatch(setCustomerLoadedData(null));
        } finally {
            setLoading(false);
            onComplete();
        }
    }

    return <Paper variant="outlined" className={classes.paper}>
        <h3 className={classes.title}>Enter your Email or Phone</h3>
        <TextField
            placeholder="Type Here"
            InputProps={{disableUnderline: true}}
            variant="standard"
            onChange={handleChange}
            value={customerEnteredEmail}
            fullWidth />
        {isXS ? <div className="grow" /> : null}
        <div className={classes.buttonsRow}>
            <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => onSelect(false)}>
                Back
            </Button>
            <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleComplete}>
                Search
            </LoadingButton>
        </div>
    </Paper>
};
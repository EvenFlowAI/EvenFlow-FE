import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../UI/Loading";
import {useCurrentUser} from "../../../../utils/hooks";

const useStyles = makeStyles((theme) => ({
    selectWrapper: {
        width: "100%",
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '12px 24px 48px 0',
        [theme.breakpoints.down("sm")]: {
            justifyContent: 'center',
            marginBottom: 20,
        }
    },
    textWrapper: {
        fontSize: 20,
        fontWeight: 600,
        [theme.breakpoints.down("sm")]: {
            fontSize: 16,
        }
    }
}))

export const ServiceCenterSwitcher = () => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {welcomeScreenView} = useSelector((state: RootState) => state.appointmentFrame);
    const {shortLoading} = useSelector((state: RootState) => state.serviceCenters);
    const currentUser = useCurrentUser();
    const classes = useStyles();

    return currentUser && scProfile && (welcomeScreenView && welcomeScreenView !== "serviceCenterSelect")
        ? <div className={classes.selectWrapper}>
            { shortLoading
                ? <Loading/>
                : <div className={classes.textWrapper}>{scProfile?.name}</div>
            }
        </div>
        : null
}

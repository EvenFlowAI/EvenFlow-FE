import React, {useEffect, useState} from "react";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {ArrowDropDown} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {IServiceCenter} from "../../../../store/reducers/serviceCenters/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {loadShortSC} from "../../../../store/reducers/serviceCenters/actions";
import {useHistory} from "react-router-dom";
import {Routes} from "../../../../config/routes";
import {encodeSCID} from "../../../../utils/utils";
import {Loading} from "../../../UI/Loading";
import {
    clearAppointmentData,
    setSideBarSteps,
    setVehicle
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {setCustomerLoadedData} from "../../../../store/reducers/appointment/actions";
import {getCurrentUser} from "../../../../store/reducers/users/actions";
import {useCurrentUser} from "../../../../utils/hooks";
import {TRole} from "../../../../store/reducers/users/types";

const useStyles = makeStyles(() => ({
    root: {
        color: "#858585",
        marginRight: 10,
        fontSize: 16,
        textTransform: "none"
    },
    selectWrapper: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
}))

const restrictedRoles: TRole[] = ["Manager", "Advisor"];

export const ServiceCenterSwitcher = () => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {shortSC, shortLoading} = useSelector((state: RootState) => state.serviceCenters);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedServiceCenter, setSelectedServiceCenter] = useState<IServiceCenter|null>(null);
    const [centersList, setCentersList] = useState<IServiceCenter[]>([]);

    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const currentUser = useCurrentUser();

    useEffect(() => {
        if (shortSC?.length && currentUser) {
            setCentersList(() => restrictedRoles.includes(currentUser?.role)
                ? shortSC.filter(item => item.id === currentUser.serviceCenterId)
                : shortSC)
        }
    }, [currentUser, shortSC, restrictedRoles])

    useEffect(() => {
        if (scProfile) {
            dispatch(loadShortSC(false, scProfile.dealershipId));
            dispatch(getCurrentUser());
        }
    }, [scProfile])

    useEffect(() => {
        if (scProfile && shortSC.length) {
            const sc = shortSC.find(item => item.id === scProfile.id);
            sc && setSelectedServiceCenter(sc);
        }
    }, [scProfile, shortSC])

    const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleChooseServiceCenter = (sc: IServiceCenter) => () => {
        handleMenuClose();
        if (selectedServiceCenter?.id !== sc.id) {
            dispatch(clearAppointmentData());
            dispatch(setSideBarSteps([]));
            dispatch(setVehicle(null));
            dispatch(setCustomerLoadedData(null));
        }
        setSelectedServiceCenter(sc);
        if (scProfile && sc.id !== scProfile.id) {
            history.push(`${Routes.EndUser.Welcome}/${encodeSCID(sc.id)}?frame=1`)
        }
    }

    return currentUser && centersList?.length
        ? <div className={classes.selectWrapper}>
            { shortLoading
                ? <Loading/>
                : <React.Fragment>
                    <Button
                        className={classes.root}
                        onClick={handleMenuOpen}
                        endIcon={<ArrowDropDown />}>
                        {selectedServiceCenter?.name}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        onClose={handleMenuClose}
                        open={Boolean(anchorEl)}>
                        {centersList.map(sc => {
                            return <MenuItem key={sc.id} onClick={handleChooseServiceCenter(sc)}>{sc.name}</MenuItem>
                        })}
                    </Menu>
                </React.Fragment>
            }
        </div>
        : null
}

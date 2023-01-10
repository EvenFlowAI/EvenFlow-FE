import React, {useEffect, useState} from "react";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {useCurrentUser} from "../../../../utils/hooks";
import {ArrowDropDown} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {IServiceCenter} from "../../../../store/reducers/serviceCenters/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {loadShortSC} from "../../../../store/reducers/serviceCenters/actions";
import {useHistory} from "react-router-dom";
import {Routes} from "../../../../config/routes";
import {encodeSCID} from "../../../../utils/utils";
import {getCurrentUser} from "../../../../store/reducers/users/actions";
import {Loading} from "../../../UI/Loading";

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

export const ServiceCenterSwitcher = () => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {shortSC, shortLoading} = useSelector((state: RootState) => state.serviceCenters);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedServiceCenter, setSelectedServiceCenter] = useState<IServiceCenter|null>(null);

    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        if (scProfile) {
            dispatch(loadShortSC(scProfile.dealershipId));
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
        setSelectedServiceCenter(sc);
        if (scProfile && sc.id !== scProfile.id) {
            history.push(`${Routes.EndUser.Welcome}/${encodeSCID(sc.id)}?frame=1`)
        }
    }

    return currentUser && shortSC.length
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
                        {shortSC.map(sc => {
                            return <MenuItem key={sc.id} onClick={handleChooseServiceCenter(sc)}>{sc.name}</MenuItem>
                        })}
                    </Menu>
                </React.Fragment>
            }
        </div>
        : null
}

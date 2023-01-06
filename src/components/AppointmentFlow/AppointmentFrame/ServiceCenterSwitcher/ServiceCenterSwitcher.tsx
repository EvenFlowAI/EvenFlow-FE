import React, {useEffect, useState} from "react";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {useCurrentUser} from "../../../../utils/hooks";
import {ArrowDropDown} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {IServiceCenterExtended} from "../../../../store/reducers/serviceCenters/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {loadDealershipSCs} from "../../../../store/reducers/serviceCenters/actions";
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
    const {dealershipSCs, dealershipLoading} = useSelector((state: RootState) => state.serviceCenters);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedServiceCenter, setSelectedServiceCenter] = useState<IServiceCenterExtended|null>(null);

    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        if (scProfile) {
            dispatch(loadDealershipSCs(scProfile.dealershipId, {pageSize: 0, pageIndex: 0}));
            dispatch(getCurrentUser());
        }
    }, [scProfile])

    useEffect(() => {
        if (scProfile && dealershipSCs.length) {
            const sc = dealershipSCs.find(item => item.id === scProfile.id);
            sc && setSelectedServiceCenter(sc);
        }
    }, [scProfile, dealershipSCs])

    const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleChooseServiceCenter = (sc: IServiceCenterExtended) => () => {
        handleMenuClose();
        setSelectedServiceCenter(sc);
        if (scProfile && sc.id !== scProfile.id) {
            history.push(`${Routes.EndUser.Welcome}/${encodeSCID(sc.id)}?frame=1`)
        }
    }
    // todo roles allowed to see this selector
    return currentUser && dealershipSCs.length
        ? <div className={classes.selectWrapper}>
            { dealershipLoading
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
                        {dealershipSCs.map(sc => {
                            return <MenuItem key={sc.id} onClick={handleChooseServiceCenter(sc)}>{sc.name}</MenuItem>
                        })}
                    </Menu>
                </React.Fragment>
            }
        </div>
        : null
}

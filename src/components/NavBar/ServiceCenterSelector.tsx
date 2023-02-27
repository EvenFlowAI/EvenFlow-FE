import React, {useState} from "react";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {useCurrentUser, useSCs} from "../../utils/hooks";
import {ArrowDropDown} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {IServiceCenter} from "../../store/reducers/serviceCenters/types";

const useStyles = makeStyles(() => ({
    root: {
        color: "#858585",
        marginRight: 10,
        fontSize: 16,
        textTransform: "none"
    }
}))

export const ServiceCenterSelector = () => {
    const {selectSC, selectedSC, scList} = useSCs();
    const currentUser = useCurrentUser();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }
    const handleChooseServiceCenter = (sc: IServiceCenter) => () => {
        handleMenuClose();
        selectSC(sc);
    }

    const classes = useStyles();
    if (!scList || !scList.length) return null;
    if (!currentUser || currentUser.isSuperUser) return null;
    // todo check if this logic is correct
    if (currentUser.role === "Manager") return null;

    return <div>
        <Button
            className={classes.root}
            onClick={handleMenuOpen}
            endIcon={<ArrowDropDown />}>
            {selectedSC?.name}
        </Button>
        <Menu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            open={Boolean(anchorEl)}>
            {scList.map(sc => {
                return <MenuItem key={sc.id} onClick={handleChooseServiceCenter(sc)}>{sc.name}</MenuItem>
            })}
        </Menu>
    </div>;
}

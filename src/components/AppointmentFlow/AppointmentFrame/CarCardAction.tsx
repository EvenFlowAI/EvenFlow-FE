import {ILoadedVehicle} from "../../../api/types";
import {TArgCallback, TCallback} from "../../../types/types";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {setVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";
import {
    Button,
    ButtonGroup,
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    styled
} from "@material-ui/core";
import {MoreVert} from "@material-ui/icons";

type TCarActionProps = {
    car: ILoadedVehicle;
    selected?: boolean;
    onAddNewAppointment: TArgCallback<ILoadedVehicle>;
    clearData: () => void;
    onNext: TCallback;
    onSelectCar: TArgCallback<ILoadedVehicle>;
}

const ActionButtons = styled("div")({
    fontSize: 20,
    width: "100%",
    "&>div:first-child": {
        width: "100%"
    },
    "& button:first-child": {
        flexGrow: 1
    }
});
const options: string[] = [
    "Schedule New Appointment"
];

const CarCardAction: React.FC<TCarActionProps> = ({car, onAddNewAppointment, clearData, onNext, onSelectCar}) => {
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(1);
    const anchorRef = useRef<HTMLDivElement|null>(null);
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const handleMenuItemClick = useCallback((event: any, index:number) => {
        setSelectedIndex(index);
       setOpen(false);
        onAddNewAppointment(car);
    }, [car]);

    const handleClose = useCallback((event: React.MouseEvent<Document, MouseEvent>) => {
        if (anchorRef.current && anchorRef.current?.contains(event?.target as Node)) {
            return;
        }
       setOpen(false);
    }, [anchorRef])

    const hasAppointments = useMemo(() => Boolean(car.appointmentHashKeys.length), [car]);

    const getLabel = useCallback((): string => {
        return hasAppointments ? t("Manage Appointment") : t("Schedule Appointment");
    }, [hasAppointments, t])

    const handleSelect = useCallback (async () => {
        await clearData()
        await dispatch(setVehicle(car));
        onSelectCar(car);
    }, [hasAppointments, car, onNext, clearData])

    const onMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setOpen(true)
    }

    return <ActionButtons>
        <ButtonGroup variant="contained" color="primary" ref={anchorRef}>
            <Button
                onClick={handleSelect}
                style={hasAppointments ? {backgroundColor: "#27AE60", borderRightColor: "#27AE60"} : {}}>
                {getLabel()}
            </Button>
            {hasAppointments
                ? <Button
                    onClick={onMenuClick}
                    size="small"
                    color="primary"
                    style={hasAppointments ? {backgroundColor: "#27AE60"} : {}}>
                <MoreVert/>
            </Button>
                : null}
        </ButtonGroup>
        <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement={"bottom-end"}
            role="presentation"
            transition disablePortal>
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin: placement === 'bottom' ? 'right top' : 'right bottom',
                    }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList>
                                {options.map((option, index) => (
                                    <MenuItem
                                        key={option}
                                        disabled={index === 2}
                                        selected={index === selectedIndex}
                                        onClick={(event) => handleMenuItemClick(event, index)}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    </ActionButtons>
};

export default React.memo(CarCardAction);
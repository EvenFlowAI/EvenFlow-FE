import React, {useRef, useState} from 'react';
import {
    Button,
    ButtonGroup,
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    styled,
    Theme
} from "@material-ui/core";
import carImage from '../../../assets/img/blank-car.svg';
import {ILoadedVehicle} from "../../../api/types";
import {useDispatch} from "react-redux";
import {setVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";
import {MoreVert} from "@material-ui/icons";
import {TArgCallback} from "../../../types/types";

type TProps = {
    car: ILoadedVehicle;
    selected?: boolean;
    onAddNewAppointment: TArgCallback<ILoadedVehicle>;
}
const Wrapper = styled('div')<Theme, {active?: boolean}>({
    display: "flex",
    padding: 22,
    flex: "1 1 0px",
    alignItems: "stretch",
    flexDirection: "column",
    gap: "12px",
    justifyContent: "center",
    transition: 'all .2s',
    border: ({active}) => `1px solid ${active ? '#000000' : '#DADADA'}`,
    '& img': {
        maxWidth: '90%',
        maxHeight: "200px",
        margin: "auto"
    },
    "& button": {
        fontSize: 14
    }
});
const CarInfo = styled('ul')({
    fontSize: 20,
    listStyle: "none",
    margin: 0,
    padding: 0,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    '&>li span': {
        color: "#BDBDBD",
        fontWeight: "normal"
    }
});
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

type TCarActionProps = {
    car: ILoadedVehicle;
    selected?: boolean;
    onAddNewAppointment: TArgCallback<ILoadedVehicle>;
}
const Action: React.FC<TCarActionProps> = ({car, onAddNewAppointment}) => {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement|null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(1);

    const handleMenuItemClick = (event: any, index:number) => {
        setSelectedIndex(index);
        setOpen(false);
        onAddNewAppointment(car);
    };
    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        if (anchorRef.current && anchorRef.current?.contains(event?.target as Node)) {
            return;
        }
        setOpen(false);
    };

    const hasAppointments = Boolean(car.appointmentHashKeys.length);
    const getLabel = (): string => {
        return hasAppointments ? "Manage Appointment" : "Schedule Appointment";
    }
    const handleSelect = () => {
        dispatch(setVehicle(car));
    }
    return <ActionButtons>
        <ButtonGroup variant="contained" color="primary" ref={anchorRef}>
            <Button onClick={handleSelect}>
                {getLabel()}
            </Button>
            {hasAppointments ? <Button onClick={() => setOpen(true)} size="small" color="primary">
                <MoreVert/>
            </Button> : null}
        </ButtonGroup>
        <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement={"bottom-end"}
            role={undefined}
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

export const CarCard: React.FC<TProps> = ({
    car,
    selected,
    onAddNewAppointment
}) => {
    return (
        <Wrapper active={selected}>
            <img src={carImage} alt="Car"/>
            <CarInfo>
                <li>{car.year} {car.make} {car.model}</li>
                <li>VIN: <span>{car.vin}</span></li>
            </CarInfo>
            <Action onAddNewAppointment={onAddNewAppointment} selected={selected} car={car} />
        </Wrapper>
    );
};
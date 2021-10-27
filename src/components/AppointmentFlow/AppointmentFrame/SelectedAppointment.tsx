import React, {useMemo} from 'react';
import {MenuItem, Select, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {getMaintenanceDescription} from "./uiUtils";
import {setAdvisor} from "../../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";
import {EServiceCenterName} from "../../../api/types";
import {selectAppointment} from "../../../store/reducers/appointment/actions";


const Wrapper = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
        flexDirection: "column"
    }
}))


const List = styled('ul')(({theme}) => ({
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "18px",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
        alignSelf: "flex-start",
    },
    "& .service-item": {
        textTransform: "capitalize"
    },
    "& ul": {
        listStyle: "none",
        marginTop: -10,
        "&>li": {
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 14,
            "&:hover": {
                textDecoration: "none"
            }
        }
    }
}));

const PriceWrapper = styled('div')(({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "right",
    "& .price": {
        fontSize: 24,
        fontWeight: "bold",
        "&>span": {
            fontSize: 18
        }
    },
    "& .info": {
        color: "#27AE60",
    }
}));
const DateWrapper = styled('div')(({theme}) => ({
    marginBottom: "auto",
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
        marginTop: 16
    }
}))

const useStyles = makeStyles(() => ({
    selectWrapper: {
        display: 'flex',
        alignItems: 'center',
        '& > span': {
            marginLeft: 5,
        }
    },
    select: {
        width: '100%',
        marginLeft: 10,
        borderRadius: 0,
        '&:before': {
            display: 'none',
        },
        '& > div': {
            '&:focus': {
                backgroundColor: 'transparent'
            }
        }
    }
}))
// TODO: Advisor|consultant
export const SelectedAppointment = () => {
    const appointmentData = useSelector(({appointmentFrame}: RootState) => appointmentFrame);
    const { selectedPackage, advisor, consultants } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile } = useSelector((state: RootState) => state.appointment);
    const appointment = useSelector((state: RootState) => state.appointment.appointment);
    const [selectedSR, srList] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests
    ]);
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);

    const price = appointment?.priceWithOffer?.value
        ?? appointment?.price.value
        ?? selectedPackage?.price ?? 0;

    const handleConsultantChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const consultant = consultants.find(item => item.id === e.target.value);
        if (isBmWService && e.target.value !== advisor?.id) dispatch(selectAppointment(null));
        if (consultant) {
            dispatch(setAdvisor(consultant))
        } else {
            dispatch(setAdvisor(null));
        }
    }

    return (
        <div>
            <h4>Your selections</h4>
            <Wrapper>
                <List>
                    <li className="service-item">Service Needed: {isXs ? <br/> : null} {
                        getMaintenanceDescription(srList, selectedSR, selectedPackage, appointmentData.service, appointmentData.subService)
                    }
                    </li>
                        <li>
                            <div className={classes.selectWrapper}>
                                Advisor: {isXs ? <br/> : null}
                                    <Select
                                        value={advisor?.id || "Any"}
                                        className={classes.select}
                                        onChange={handleConsultantChange}>
                                        {isBmWService
                                            ? consultants
                                                .map(consultant => <MenuItem value={consultant.id}>{consultant.name}</MenuItem>)
                                                .concat([<MenuItem value="Any">Any Available</MenuItem>])
                                            : <MenuItem value={advisor ? advisor.id : "Any"}>
                                                {advisor ? advisor.name : 'Any Available'}
                                              </MenuItem>
                                        }
                                    </Select>
                            </div>
                        </li>

                </List>
                <PriceWrapper>
                    {appointment ? <DateWrapper>
                        Date & Time: <br /> {appointment.date.format('MMMM D, h:mm A')}
                    </DateWrapper> : null}
                    {selectedPackage
                        ? <>
                            <div className="price">$
                                {Math.floor(price)}
                                <span>
                                    .{(price % 1).toFixed(2).slice(2)}
                                </span>
                            </div>
                            <div className="info" style={{ fontSize: isXs ? 14: 28 }}>Save by booking at off peak times!</div>
                        </> : null}
                    </PriceWrapper>
            </Wrapper>
        </div>
    );
};
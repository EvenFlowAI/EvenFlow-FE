import React, {useEffect, useMemo} from 'react';
import {MenuItem, Select, styled, useMediaQuery, useTheme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {getMaintenanceDescription} from "./uiUtils";
import {setAdvisor} from "../../../store/reducers/appointmentFrameReducer/actions";
import {makeStyles} from "@material-ui/core/styles";
import {EServiceCenterName} from "../../../api/types";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import {loadCategoriesByQuery} from "../../../store/reducers/categories/actions";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {EPricingDisplayType} from "../../../store/reducers/pricingSettings/types";


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
    [theme.breakpoints.down("sm")]: {
        alignSelf: "flex-start",
        gap: "10px",
        width: "100%",
    },
    "& .service-item": {
        textTransform: "capitalize",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            "& .price": {
                fontSize: 20,
                fontWeight: "bold",
                "&>span": {
                    fontSize: 14
                }
            },
        },
        "& .service-list": {
            display: 'block',
            maxHeight: 120,
            overflow: "auto",
            padding: '8px 8px 8px 0',
        }
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

const PriceWrapper = styled('div')(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "right",
    [theme.breakpoints.down("sm")]: {
        alignItems: "flex-start",
    },
    "& .price": {
        fontSize: 24,
        fontWeight: "bold",
        "&>span": {
            fontSize: 18
        }
    },
    "& .info": {
        color: "#27AE60",
        [theme.breakpoints.down("sm")]: {
            marginTop: 5
        }
    }
}));

const DateWrapper = styled('div')(({theme}) => ({
    marginBottom: "auto",
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
        marginTop: 8,
        textAlign: "left",
    }
}))

const useStyles = makeStyles(theme => ({
    selectWrapper: {
        display: 'flex',
        alignItems: 'center',
        '& > span': {
            marginLeft: 5,
        },
        [theme.breakpoints.down("sm")]: {
            '& > div > div': {
                padding: 5
            }
        },
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
        },
    }
}))

export const SelectedAppointment = () => {
    const { selectedPackage, advisor, consultants, categoriesIds, serviceType, address, zipCode, valueService } = useSelector((state: RootState) => state.appointmentFrame);
    const { scProfile, appointmentSlots, appointment } = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
    const [selectedSR, srList] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests
    ]);
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);
    const selectedServices = useMemo(() => getMaintenanceDescription(srList, selectedSR, selectedPackage, allCategories, categoriesIds, valueService),
        [srList, selectedSR, selectedPackage, allCategories, categoriesIds, valueService])
    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType])

    const price = appointment?.price.value ?? 0;
    const isDynamicPricing = appointmentSlots.length ? appointmentSlots[0]?.serviceRequestPrices?.find(item => item.pricingDisplayType === EPricingDisplayType.Dynamic) : false;

    const handleConsultantChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const consultant = consultants.find(item => item.id === e.target.value);
        if (isBmWService && e.target.value !== advisor?.id) dispatch(selectAppointment(null));
        dispatch(setAdvisor(consultant ? consultant : null))
    }

    useEffect(() => {
        scProfile && dispatch(loadCategoriesByQuery(scProfile.id))
    }, [scProfile])

    return (
        <div>
            {!isSm && <h4>Your selections</h4>}
            <Wrapper>
                <List>
                    <li className={"service-item"} key="service-item">
                        <div className="service-list">
                            {selectedServices.map(item => <div key={item}>{item}</div>)}
                        </div>
                        { isSm && Boolean(price) &&
                        <div className="price">
                          ${scProfile?.isRoundPrice ? price : price.toFixed(2)}
                        </div> }
                    </li>
                    <li key="advisor">
                        {serviceType === EServiceType.VisitCenter
                            ? <div className={classes.selectWrapper}>
                            <div className={classes.selectWrapper}>
                                Advisor: {isSm ? <br/> : null}
                                <Select
                                    value={advisor?.id || "Any"}
                                    className={classes.select}
                                    disabled={currentConfig && !currentConfig?.advisorSelection}
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
                            </div>
                            : address
                                ? <div className="service-list">
                                    <h4> YOUR ADDRESS: </h4>
                                    <div>{`${address?.label}` || ""}{zipCode ? `, ${zipCode}` : ""}</div>
                                </div>
                                : null
                            }
                        {appointment && isSm ? <DateWrapper>
                            {appointment.date.format('MMMM D, h:mm A')}
                        </DateWrapper> : null}
                    </li>

                </List>
                <PriceWrapper>
                    {appointment && !isSm
                        ? <DateWrapper>
                        Date & Time: <br /> {appointment.date.format('MMMM D, h:mm A')}
                    </DateWrapper>
                        : null}
                    <>
                        {!isSm && Boolean(price) && <div className="price">
                          ${scProfile?.isRoundPrice ? price : price.toFixed(2)}
                        </div>}
                        {isDynamicPricing && (
                            <div className="info" style={{ fontSize: isSm ? 14: 28 }}>
                          Save by booking at off peak times!
                        </div>
                        )}
                    </>
                    </PriceWrapper>
            </Wrapper>
        </div>
    );
};
import React, {useMemo} from 'react';
import {Grid, styled, Theme} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {mh400, mh600} from "./CustomerSelect";
import {RootState} from "../../store/rootReducer";
import {EServiceType, EUserType} from "../../store/reducers/appointmentFrameReducer/types";
import {
    getBlankCustomer,
    getBlankVehicle,
    saveCustomerCache,
    setCustomerLoadedData
} from "../../store/reducers/appointment/actions";
import {
    clearAppointmentData,
    setCurrentFrameScreen,
    setServiceTypeOption,
    setVehicle,
    setWelcomeScreenView
} from "../../store/reducers/appointmentFrameReducer/actions";
import ReactGA from "react-ga4";
//import ReactGA from "react-ga";
import {Loading} from "../UI/Loading";
import {makeStyles} from "@material-ui/core/styles";
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {InfoOutlined} from "@material-ui/icons";
import {HtmlTooltip} from "../AppointmentFlow/AppointmentFrame/ServiceCard";
import ServiceTypeIcon from "./ServiceTypeIcon";
import {Actions} from "../AppointmentFlow/AppointmentFrame/Actions";
import {useCurrentUser} from "../../utils/hooks";
import {Routes} from "../../config/routes";
import {encodeSCID} from "../../utils/utils";
import {useHistory, useParams} from "react-router-dom";

type TProps = {
    onComplete: (serviceType: IFirstScreenOption, userType?: EUserType) => void;
    loading: boolean;
};

const CardsWrapper = styled(({cardsAmount, ...props}) => (<div {...props}/>))<Theme, {cardsAmount: number}>(({theme, cardsAmount}) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cardsAmount}, 1fr)`,
    gap: "18px",
    marginTop: "5%",
    marginBottom: 20,
    justifyItems: cardsAmount === 1 ? "center" : "unset",
    '& > div': {
        minWidth:   cardsAmount === 1 ? 440 : 'unset'
    },
    [mh600]: {
        marginTop: "2%"
    },
    [theme.breakpoints.down("sm")]: {
        gridTemplateRows: `repeat(${cardsAmount}, 1fr)`,
        gridTemplateColumns: '1fr',
        marginTop: theme.spacing(5)
    }
}));

const Tagline = styled(({taglineColor, ...props}) => (<div {...props}/>))<Theme, {taglineColor?: string}>(({theme, taglineColor}) => ({
    minHeight: 40,
    width: '100%',
    display: 'flex',
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 20,
    paddingBottom: 16,
    color: taglineColor ? `#${taglineColor}` : 'inherit',
}))

const Button = styled(({isTaglinePresent, ...props}) => (<div {...props}/>))<Theme, {isTaglinePresent: boolean}>(({theme, isTaglinePresent}) => ({
    position: 'relative',
    height: "100%",
    maxHeight: 285,
    //display: "flex",
    display: "grid",
    gridTemplateRows: isTaglinePresent ? '1fr 2fr 3fr' : '1fr 3fr',
    gridGap: isTaglinePresent ? 10 : 20,
    // flexDirection: 'column',
    // alignItems: "center",
    // alignContent: "center",
    // justifyContent: "center",
    // justifyItems: "center",
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
    cursor: "pointer",
    padding: "10%",
    border: "1px solid #DADADA",
    background: "#FFFFFF",
    transition: theme.transitions.create(["box-shadow"]),
    "&:hover": {
        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
    },
    [mh600]: {
        fontSize: 22,
        padding: "7%"
    },
    [`${mh400} and (orientation: portrait)`]: {
        fontSize: 18,
        padding: "2%"
    },
    [theme.breakpoints.down("sm")]: {
        justifyItems: 'center',
    },
    [theme.breakpoints.down("xs")]: {
        fontSize: 18,
        padding: "5% 10%"
    },
    "& .infoIcon": {
        position: 'absolute',
        top: 15,
        right: 15,
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

const useStyles = makeStyles((theme) => ({
    name: {
        width: "100%",
        fontSize: 28,
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
    }
}))

const ServiceTypeSelect: React.FC<TProps> = ({onComplete, loading }) => {
    const {userType, selectedVehicle} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions, isLoading} = useSelector((state: RootState) => state.serviceTypes);
    const {customerLoadedData, scProfile} = useSelector((state: RootState) => state.appointment);
    const {id} = useParams();
    const classes = useStyles();
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const history = useHistory();
    const isTaglinePresent = useMemo(() => firstScreenOptions.find(el => el?.taglineText?.length), [firstScreenOptions]);

    const handleUser = (service: IFirstScreenOption) => {
        if (userType === EUserType.New) {
            const c = getBlankCustomer();
            dispatch(setCustomerLoadedData(c));
            dispatch(setVehicle(getBlankVehicle()));
            saveCustomerCache(c);
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Enters Page',
                label: `As New User`,
            });
        }
        onComplete(service);
    }

    const handleSelect = (card: IFirstScreenOption) => {
        dispatch(clearAppointmentData())
        dispatch(setServiceTypeOption(card))
        if (card.type === EServiceType.General) {
            if (card.externalLink) window.location.href = card.externalLink;
        } else {
            handleUser(card);
        }
    }

    const redirect = () => {
        if (id) {
            history.push(Routes.EndUser.AppointmentFrame.replace(":id", id));
        } else if (scProfile?.id) {
            history.push(Routes.EndUser.AppointmentFrame.replace(":id", encodeSCID(scProfile.id)));
        }
    }

    const handleBack = () => {
        if (currentUser || (!customerLoadedData?.id && !selectedVehicle?.make) || userType === EUserType.New) {
            dispatch(setWelcomeScreenView("select"))
        } else {
            dispatch(setCurrentFrameScreen("carSelection"))
            redirect()
        }
    }

    return isLoading || loading
        ? <Loading/>
        : <div className={classes.wrapper}>
            <CardsWrapper cardsAmount={firstScreenOptions.length}>
                {[...firstScreenOptions]
                    .sort((a, b) => a && b ? a.orderIndex - b.orderIndex : 0)
                    .map((card) => {
                        if (card) {
                            return <Grid key={card.id}>
                                <Button onClick={() => handleSelect(card)} isTaglinePresent={!!isTaglinePresent}>
                                    {card.description ? <HtmlTooltip
                                        enterTouchDelay={0}
                                        placement="right-end"
                                        title={<div>{card.description.split('\n').map(line => <p key={line}>{line}</p>)}</div>}
                                    >
                                        <div className="infoIcon"><InfoOutlined style={{ color: "#828282" }}/></div>
                                    </HtmlTooltip> : null}
                                    <div className={classes.name}>{card.name}</div>
                                    {isTaglinePresent ? <Tagline taglineColor={card.taglineFontColorHex}>{card.taglineText}</Tagline> : null}
                                    <ServiceTypeIcon card={card}/>
                                </Button>
                            </Grid>
                        }
                    })}
            </CardsWrapper>
            <Actions onBack={handleBack} onNext={() => {}} hideNext/>
        </div>
};

export default ServiceTypeSelect;
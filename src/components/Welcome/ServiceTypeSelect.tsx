import React, {useMemo} from 'react';
import {Grid, styled, Theme, useMediaQuery, useTheme} from "@material-ui/core";
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
import {setServiceType, setServiceTypeOption, setVehicle} from "../../store/reducers/appointmentFrameReducer/actions";
//import ReactGA from "react-ga4";
import ReactGA from "react-ga";
import {Loading} from "../UI/Loading";
import {makeStyles} from "@material-ui/core/styles";
import {IFirstScreenOption} from "../../store/reducers/serviceTypes/types";
import {InfoOutlined} from "@material-ui/icons";
import {HtmlTooltip} from "../AppointmentFlow/AppointmentFrame/ServiceCard";
import ServiceTypeIcon from "./ServiceTypeIcon";

type TProps = {
    onComplete: (serviceType: IFirstScreenOption, userType?: EUserType) => void;
    loading: boolean;
};

const CardsWrapper = styled(({cardsAmount, ...props}) => (<div {...props}/>))<Theme, {cardsAmount: number}>(({theme, cardsAmount}) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cardsAmount}, 1fr)`,
    gap: "18px",
    marginTop: "5%",
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
    height: 40,
    width: '100%',
    display: 'flex',
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 20,
    paddingBottom: 16,
    color: taglineColor ? `#${taglineColor}` : 'inherit',
}))

const useStyles = makeStyles((theme) => ({
    button: {
        position: 'relative',
        height: "100%",
        maxHeight: 285,
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
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
        [mh400]: {
            fontSize: 18,
            padding: "2%"
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
    },
    name: {
        width: "100%",
        fontSize: 28,
        marginBottom: 20,
    }
}))

const ServiceTypeSelect: React.FC<TProps> = ({onComplete, loading }) => {
    const {userType, isMobileServiceOn, isPickUpDropOffServiceOn} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions, isLoading} = useSelector((state: RootState) => state.serviceTypes);
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down("sm"))
    const remappedCards = useMemo(() => firstScreenOptions
            .map(card => {
                if (card.type === EServiceType.MobileService && !isMobileServiceOn) return null;
                if (card.type === EServiceType.PikUpDropOff && !isPickUpDropOffServiceOn) return null;
                return card
            })
        .filter(card => card), [firstScreenOptions, isMobileServiceOn, isPickUpDropOffServiceOn])
    const isTaglinePresent = useMemo(() => remappedCards.find(el => el?.taglineText?.length), [remappedCards]);

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
        dispatch(setServiceTypeOption(card))
        card.type && dispatch(setServiceType(card.type));
        if (card.type === EServiceType.General) {
            if (card.externalLink) window.location.href = card.externalLink;
        } else {
            handleUser(card);
        }
    }

    return isLoading || loading
        ? <Loading/>
        : <CardsWrapper cardsAmount={remappedCards.length}>
            {[...remappedCards]
                .sort((a, b) => a && b ? a.orderIndex - b.orderIndex : 0)
                .map((card) => {
                    if (card) {
                        return <Grid key={card.id}>
                            <div className={classes.button} onClick={() => !isSM && handleSelect(card)}>
                                {card.description ? <HtmlTooltip
                                    enterTouchDelay={0}
                                    placement="right-end"
                                    title={<div>{card.description.split('\n').map(line => <p key={line}>{line}</p>)}</div>}
                                >
                                    <div className="infoIcon"><InfoOutlined style={{ color: "#828282" }}/></div>
                                </HtmlTooltip> : null}
                                <div className={classes.name} onClick={() => isSM && handleSelect(card)}>{card.name}</div>
                                {isTaglinePresent ? <Tagline taglineColor={card.taglineFontColorHex}>{card.taglineText}</Tagline> : null}
                                <ServiceTypeIcon card={card} onClick={() => isSM && handleSelect(card)} isSM={isSM}/>
                            </div>
                        </Grid>
                    }
            })}
        </CardsWrapper>
};

export default ServiceTypeSelect;
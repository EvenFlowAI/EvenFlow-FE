import React, {useEffect, useState} from 'react';
import {TCallback} from "../../../types/types";
import {IServiceCategory} from "../../../api/types";
import {ReactComponent as Icon} from "../../../assets/img/oil-icon.svg";
import axios from "axios";
import {Loading} from "../../UI/Loading";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {styled, Theme, Tooltip, useMediaQuery, useTheme, withStyles} from "@material-ui/core";
import {InfoOutlined} from "@material-ui/icons";

type TSCProps = {
    card: IServiceCategory;
    onSelect: TCallback;
    active: boolean;
    selected: boolean;
}

const CardWrapper = styled(({active, selected, ...props}) => <div {...props}/>)<Theme, {active?: boolean, selected?: boolean}>(({theme, active, selected}) => {
    return {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr 4fr 3fr 2fr",
        width: "100%",
        maxWidth: 250,
        transition: "all .2s",
        fontSize: 24,
        textAlign: "center",
        alignItems: "center",
        padding: 10,
        background: active ? '#000000' : selected ? "#DEFFDF" : "transparent",
        border: `1px solid ${active ? '#000000' : selected ? '#89E5AB' : '#DADADA'}`,
        cursor: "pointer",
        "& .priceWrapper": {
            height: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: "0 12px",
            [theme.breakpoints.down('sm')]: {
                gridColumn: "1/3",
            }
        },
        "& .price": {
            color: "#27AE60",
            fontSize: 20,
            fontWeight: "bold",
        },
        "& .text": {
            color: "#727273",
            fontSize: 11,
            fontWeight: "bold",
            fontFamily: "Proxima Nova",
            textTransform: "uppercase",
        },
        "& .infoIcon": {
            display: 'flex',
            justifyContent: 'flex-end',
            [theme.breakpoints.down("sm")]: {
                position: 'absolute',
                top: 10,
                right: 10,
            }
        },
        [theme.breakpoints.down('sm')]: {
            position: 'relative',
            gridTemplateColumns: "1fr 3fr",
            gridTemplateRows: "1fr",
            fontSize: 18,
            ".cardIcon": {
                width: 65,
                height: 65
            }
        }
    }
});

const HtmlTooltip = withStyles({
    tooltip: {
        fontSize: 13,
        color: '#202021',
        background: '#D1D1D1',
    },
    popper: {
        borderRadius: 2,
    }
})(Tooltip);

export const ServiceCard: React.FC<TSCProps> = ({card, onSelect, active, selected}) => {
    const [icon, setIcon] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));

    const price = card.type === EServiceCategoryType.GeneralCategory ? card.price : undefined;

    useEffect(() => {
        if (card.iconPath) {
            setLoading(true);
            axios.get(card.iconPath, {withCredentials: false})
                .then(({ data }) => {
                    setIcon(data)
                })
                .finally(() => setLoading(false))
        }
    }, [card])

    return <CardWrapper
        onClick={onSelect}
        selected={selected}
        active={active}>
        {card.description ? <HtmlTooltip
            placement="right-end"
            title={<div>{card.description.split('\n').map(line => <p key={line}>{line}</p>)}</div>}
        >
            <div className="infoIcon"><InfoOutlined style={{ color: "#828282", filter: active ? "invert(100%)" : "unset"}}/></div>
        </HtmlTooltip> : isSM ? null : <div/>}
        {isLoading
            ? <Loading/>
            : card.iconPath && icon
                ? <span className="cardIcon" style={{ filter: active ? "invert(100%)" : "unset"}} dangerouslySetInnerHTML={{__html: icon}} />
                : <span className="cardIcon" style={{ filter: active ? "invert(100%)" : "unset"}}><Icon /></span>
        }
        <span style={{color: active ? "#FFFFFF" : "#252733"}}>{card.name}</span>
        {!!price ? <div className="priceWrapper">
            <span className="text">Starting At</span>
            <span className="price">${scProfile?.isRoundPrice ? price : price.toFixed(2)}</span>
        </div> : null}
    </CardWrapper>
}
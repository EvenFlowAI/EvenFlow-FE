import React, {useEffect, useState} from 'react';
import {TCallback} from "../../../../../types/types";
import {IServiceCategory} from "../../../../../api/types";
import {ReactComponent as Icon} from "../../../../../assets/img/oil-icon.svg";
import axios from "axios";
import {Loading} from "../../../../../components/wrappers/Loading/Loading";
import {EServiceCategoryType} from "../../../../../store/reducers/categories/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useMediaQuery, useTheme} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {EOfferType} from "../../../../../store/reducers/offers/types";
import {HtmlTooltip} from "../../../../../components/styled/HtmlTooltip";
import {CardWrapper} from "./styles";

type TSCProps = {
    card: IServiceCategory;
    onSelect: TCallback;
    active: boolean;
    selected: boolean;
}

export const ServiceCard: React.FC<TSCProps> = ({card, onSelect, active, selected}) => {
    const [icon, setIcon] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down('md'));
    const {t} = useTranslation();

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
        {
            card.description
            ? <HtmlTooltip
            enterTouchDelay={0}
            placement="top-end"
            title={<div>{card.description.split('\n').map(line => <p key={line}>{line}</p>)}</div>}
        >
            <div className="infoIcon"><InfoOutlined style={{ color: "#828282", filter: active ? "invert(100%)" : "unset"}}/></div>
        </HtmlTooltip>
            : isSM
                ? null
                : <div/>
        }
        {isLoading
            ? <Loading/>
            : card.iconPath && icon
                ? <span className="cardIcon" style={{ filter: active ? "invert(100%)" : "unset"}} dangerouslySetInnerHTML={{__html: icon}} />
                : <span className="cardIcon" style={{ filter: active ? "invert(100%)" : "unset"}}><Icon /></span>
        }
        <span style={{color: active ? "#FFFFFF" : "#252733"}}>{card.name}</span>
        {!!price
            ? <div className="priceWrapper">
                    <span className="text">{t("Starting At")}</span>
                    <span
                        className={card.offer
                            ? card.offer.type === EOfferType.AmountOff
                                ? "blueStrikePrice"
                                : "bluePrice"
                            : "price" }>
                ${scProfile?.isRoundPrice ? price : price.toFixed(2)}
            </span>
                </div>
            : null}
        {/*todo uncomment for offer new functionality*/}
        {/*{card.offer*/}
        {/*    ? <React.Fragment>*/}
        {/*        <div className="priceWrapper">*/}
        {/*            <span className="text">{t("Special")}</span>*/}
        {/*            <span className="price">{getOfferString(card.offer, Boolean(scProfile?.isRoundPrice))}</span>*/}
        {/*        </div>*/}
        {/*        <div className="expiringDate">{t("Expires")}{moment(card.offer.expiringDate).format('MM/DD/YY')}</div>*/}
        {/*    </React.Fragment>*/}
        {/*    : <div/>*/}
        {/*}*/}
    </CardWrapper>
}
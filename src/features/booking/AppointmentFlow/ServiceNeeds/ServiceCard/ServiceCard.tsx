import React from 'react';
import {TCallback} from "../../../../../types/types";
import {IServiceCategory} from "../../../../../api/types";
import {EServiceCategoryType} from "../../../../../store/reducers/categories/types";
import {useMediaQuery, useTheme} from "@mui/material";
import {CardWrapper} from "./styles";
import CardIcon from "./CardIcon/CardIcon";
import CardPrice from "./CardPrice/CardPrice";
import CardDescription from "./CardDescription/CardDescription";

type TSCProps = {
    card: IServiceCategory;
    onSelect: TCallback;
    active: boolean;
    selected: boolean;
}

export const ServiceCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TSCProps>>> = ({card, onSelect, active, selected}) => {
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down('md'));
    const price = card.type === EServiceCategoryType.GeneralCategory ? card.price : undefined;

    return <CardWrapper
        onClick={onSelect}
        selected={selected}
        active={active}>
        <CardDescription description={card.description} isSM={isSM} active={active}/>
        <CardIcon iconPath={card.iconPath} isSM={isSM} active={active}/>
        <span style={{color: active ? "#FFFFFF" : "#252733"}}>{card.name}</span>
        {!isSM ? <CardPrice price={price} offer={card.offer}/> : null}

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
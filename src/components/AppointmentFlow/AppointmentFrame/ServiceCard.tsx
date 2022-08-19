import React, {useEffect, useState} from 'react';
import {TCallback} from "../../../types/types";
import {CardWrapper} from "./styled";
import {IServiceCategory} from "../../../api/types";
import {ReactComponent as Icon} from "../../../assets/img/oil-icon.svg";
import axios from "axios";
import {Loading} from "../../UI/Loading";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Tooltip, withStyles} from "@material-ui/core";
import {InfoOutlined} from "@material-ui/icons";

type TSCProps = {
    card: IServiceCategory;
    onSelect: TCallback;
    active: boolean;
    selected: boolean;
}

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
        style={{
            background: active ? '#000000' : selected ? "#DEFFDF" : "transparent",
            border: `1px solid ${active ? '#000000' : selected ? '#89E5AB' : '#DADADA'}`,
        }}>
        {card.description ? <HtmlTooltip
            placement="right-end"
            title={<div>{card.description.split('\n').map(line => <p key={line}>{line}</p>)}</div>}
        >
            <div className="infoIcon"><InfoOutlined style={{ color: "#828282", filter: active ? "invert(100%)" : "unset"}}/></div>
        </HtmlTooltip> : <div/>}
        {isLoading
            ? <Loading/>
            : card.iconPath && icon
                ? <span style={{ filter: active ? "invert(100%)" : "unset"}} dangerouslySetInnerHTML={{__html: icon}} />
                : <span style={{ filter: active ? "invert(100%)" : "unset"}}><Icon /></span>
        }
        <span style={{color: active ? "#FFFFFF" : "#252733"}}>{card.name}</span>
        {!!price ? <div className="priceWrapper">
            <span className="text">Starting At</span>
            <span className="price">${scProfile?.isRoundPrice ? price : price.toFixed(2)}</span>
        </div> : null}
    </CardWrapper>
}
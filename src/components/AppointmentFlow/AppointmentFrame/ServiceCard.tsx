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

    return <CardWrapper onClick={onSelect} active={active} selected={selected}>
        {isLoading
            ? <Loading/>
            : card.iconPath && icon
                ? <span style={{ filter: active ? "invert(100%)" : "unset"}} dangerouslySetInnerHTML={{__html: icon}} />
                 : <span style={{ filter: active ? "invert(100%)" : "unset"}}><Icon /></span>
        }
        <span style={{color: active ? "#FFFFFF" : "#252733"}}>{card.name}</span>
        <div className="priceWrapper">
            {!!price ? <>
                <span className="text">Starting At</span>
                <span className="price">${scProfile?.isRoundPrice ? price : price.toFixed(2)}</span>
            </> : null}
        </div>
    </CardWrapper>
}
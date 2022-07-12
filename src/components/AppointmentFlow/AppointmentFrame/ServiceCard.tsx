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
import {Tooltip, styled} from "@material-ui/core";

type TSCProps = {
    card: IServiceCategory;
    onSelect: TCallback;
    active: boolean;
    selected: boolean;
}

const HtmlTooltip = styled(({ className, children, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }}>{children}</Tooltip>
))(({ theme }) => ({
    maxWidth: 200,
    fontSize: theme.typography.pxToRem(12),
}));

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

    const cardComponent = <CardWrapper onClick={onSelect} activeNow={active} selected={selected}>
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
    </CardWrapper>;

    return card.serviceRequests.length > 0
        ? <HtmlTooltip
            placement="top"
            title={<div>{card.serviceRequests.map(item => (<p>- {item.description}</p>))}</div>}
        >
            {cardComponent}
        </HtmlTooltip> : cardComponent;
}
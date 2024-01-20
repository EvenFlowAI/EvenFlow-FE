import {ITransportation} from "../../../../../api/types";
import {TArgCallback} from "../../../../../types/types";
import React from "react";
import {useTranslation} from "react-i18next";
import {CardOptions, CardWrapper} from "./styles";
import {RadioButtonChecked, RadioButtonUnchecked} from "@mui/icons-material";

export type TTransportationProps = {
    transportation: string;
    selectedTransportation: ITransportation | null;
    active?: boolean;
    options: ITransportation[] | null;
    onSelectOption: TArgCallback<ITransportation>;
}

export const TransportationCard: React.FC<React.PropsWithChildren<TTransportationProps>> = ({
                                                                       selectedTransportation,
                                                                       transportation,
                                                                       active,
                                                                       options,
                                                                       onSelectOption
                                                                   }) => {
    const {t} = useTranslation();

    const handleClick = (t: ITransportation) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        onSelectOption(t);
    }

    return <CardWrapper active={active}>
        {transportation}
        {(active && options)
            ? <CardOptions>{options.map(option => {
                    const isActive = option.type === selectedTransportation?.type
                    return <li
                        onClick={handleClick(option)}
                        className={isActive ? "active" : undefined}
                        key={option.type}>
                        {isActive ? <RadioButtonChecked fontSize={'small'}/> : <RadioButtonUnchecked fontSize={'small'}/>}
                        {t(option.description)}
                    </li>;
                }
            )}</CardOptions>
            : null}
    </CardWrapper>
}
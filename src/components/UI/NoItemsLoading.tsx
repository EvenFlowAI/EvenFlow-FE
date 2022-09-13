import React, {ReactElement} from 'react';
import {Box, CircularProgress} from "@material-ui/core";
import {Loading} from "./Loading";
import {useTranslation} from "react-i18next";

type TProps = {
    loading?: boolean;
    label?: string;
    items: any[];
    wrapperStyles?: React.CSSProperties;
}
const divStyles = {textAlign: "center" as const, width: "100%"};
export const NoItemsLoading: React.FC<TProps> = ({loading, items, label, wrapperStyles}) => {
    const {t} = useTranslation();
    if (loading) {
        return <div style={{...divStyles, ...(wrapperStyles ?? {})}}>
            <CircularProgress />
        </div>;
    } else if (!items.length) {
        return <div style={{...divStyles, ...(wrapperStyles ?? {})}}>
            {label ? label : `${t("No items")}.`}
        </div>
    } else {
        return null;
    }
};

type TWrapperProps = {
    isLoading: boolean;
    itemsExist: boolean;
    noItemsLabel?: string;
    children: ReactElement;
}

export const LoadingWrapper: React.FC<TWrapperProps> = ({
    isLoading, itemsExist, noItemsLabel, children}) => {
    const {t} = useTranslation();
    return isLoading
        ? <Loading />
        : itemsExist
            ? children
            : <Box p={2} textAlign="center">{noItemsLabel ?? `${t("No items")}...`}</Box>;
}
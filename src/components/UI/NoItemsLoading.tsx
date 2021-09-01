import React, {ReactElement} from 'react';
import {Box, CircularProgress} from "@material-ui/core";
import {Loading} from "./Loading";

type TProps = {
    loading?: boolean;
    label?: string;
    items: any[];
    wrapperStyles?: React.CSSProperties;
}
const divStyles = {textAlign: "center" as const, width: "100%"};
export const NoItemsLoading: React.FC<TProps> = ({loading, items, label, wrapperStyles}) => {
    if (loading) {
        return <div style={{...divStyles, ...(wrapperStyles ?? {})}}>
            <CircularProgress />
        </div>;
    } else if (!items.length) {
        return <div style={{...divStyles, ...(wrapperStyles ?? {})}}>
            {label ? label : "No items."}
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
    return isLoading
        ? <Loading />
        : itemsExist
            ? children
            : <Box p={2} textAlign="center">{noItemsLabel ?? "No items..."}</Box>;
}
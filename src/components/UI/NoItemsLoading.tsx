import React from 'react';
import {CircularProgress} from "@material-ui/core";

type TProps = {
    loading?: boolean;
    label?: string;
    items: any[];
}
const divStyles = {textAlign: "center" as const, width: "100%"};
export const NoItemsLoading: React.FC<TProps> = ({loading, items, label}) => {
    if (loading) {
        return <div style={divStyles}>
            <CircularProgress />
        </div>;
    } else if (!items.length) {
        return <div style={divStyles}>
            {label ? label : "No items."}
        </div>
    } else {
        return null;
    }
};
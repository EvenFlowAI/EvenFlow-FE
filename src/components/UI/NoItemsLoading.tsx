import React from 'react';
import {CircularProgress} from "@material-ui/core";

type TProps = {
    loading?: boolean;
    label?: string;
    items: any[];
}
export const NoItemsLoading: React.FC<TProps> = ({loading, items, label}) => {
    if (loading) {
        return <CircularProgress />;
    } else if (!items.length) {
        return <div style={{textAlign: "center", width: "100%"}}>
            {label ? label : "No items."}
        </div>
    } else {
        return null;
    }
};
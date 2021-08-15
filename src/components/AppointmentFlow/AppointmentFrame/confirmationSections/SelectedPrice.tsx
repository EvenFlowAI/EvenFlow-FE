import React from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";

const Price = styled('div')({
    marginTop: 8
})

export const SelectedPrice = () => {
    return (
        <div>
            <ConfirmationTitle>Selected Price</ConfirmationTitle>
            <Price>$148</Price>
        </div>
    );
};
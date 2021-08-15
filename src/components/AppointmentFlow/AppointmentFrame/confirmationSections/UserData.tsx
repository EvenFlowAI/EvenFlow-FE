import React from 'react';
import {styled} from "@material-ui/core";
import {ConfirmationTitle} from "../Title";
import {TextField} from "../../../UI/TextField";

const Wrapper = styled('div')({
    "& label": {
        marginTop: 12
    }
})

export const UserData = () => {
    return (
        <Wrapper>
            <ConfirmationTitle>Customer Information</ConfirmationTitle>
            <TextField fullWidth placeholder="Type here" label="Full Name" />
            <TextField fullWidth placeholder="Type here" label="Phone Number" />
            <TextField fullWidth placeholder="Type here" label="Email" />
        </Wrapper>
    );
};
import React from 'react';
import {ConfirmationTitle} from "../Title";
import moment from "moment";
import {Edit} from "@material-ui/icons";
import {styled} from "@material-ui/core";

const TitleWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: 8,
    "& svg": {
        color: "#757575"
    }
})

export const SelectedDate = () => {
    return <div>
        <TitleWrapper>
            <ConfirmationTitle>Selected Date</ConfirmationTitle>
            <Edit fontSize="small" />
        </TitleWrapper>
        {moment().format('MMMM D, h:mm A')}
    </div>
};
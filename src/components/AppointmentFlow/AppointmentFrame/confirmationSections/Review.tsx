import React from 'react';
import {ConfirmationTitle} from "../Title";
import {styled} from "@material-ui/core";

const Wrapper = styled('ul')({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: "12px",
    margin: "12px 0 0",
    padding: 0,
    listStyle: "none"
});
const ButtonLink = styled('div')({
    textDecoration: "underline",
    marginTop: 10,
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
        textDecoration: "none"
    }
})

export const Review = () => {
    return (
        <div>
            <ConfirmationTitle>Review</ConfirmationTitle>
            <Wrapper>
                <li>2019 Ford Focus</li>
                <li>The Works Preferred</li>
                <li>Transportation needs: Take the shuttle  </li>
                <li>Consultant: Mike Graham</li>
            </Wrapper>
            <ButtonLink>View Details</ButtonLink>
        </div>
    );
};
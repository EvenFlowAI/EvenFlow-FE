import React from 'react';
import {styled} from "@material-ui/core";


const Wrapper = styled('div')({
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between"
})


const List = styled('ul')({
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "18px",
    fontSize: 16,
    fontWeight: "bold",
    "& ul": {
        listStyle: "none",
        marginTop: -10,
        "&>li": {
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 14,
            "&:hover": {
                textDecoration: "none"
            }
        }
    }
});

const PriceWrapper = styled('div')({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "right",
    "& .price": {
        fontSize: 24,
        fontWeight: "bold",
        "&>span": {
            fontSize: 18
        }
    },
    "& .info": {
        color: "#27AE60"
    }
})

export const SelectedAppointment = () => {
    return (
        <div>
            <h4>Your selections</h4>
            <Wrapper>
                <List>
                    <li>Service Needed: Service</li>
                    <li>Consultant: Any Available</li>
                    <ul>
                        <li>See available times for any Consultant</li>
                    </ul>
                </List>
                <PriceWrapper>
                    <div className="price">$148<span>.00</span></div>
                    <div className="info">Save by booking at off peak times!</div>
                </PriceWrapper>
            </Wrapper>
        </div>
    );
};
import React from 'react';
import {Button} from "@material-ui/core";
import {useModal} from "../../../utils/hooks";
import {NewOffer} from "./NewOffer";

export const ActiveOffers = () => {
    const {onOpen: onOfferOpen, onClose: onOfferClose, isOpen: isOfferOpen} = useModal();
    return (
        <div>
            <div style={{textAlign: "right"}}>
                <Button
                    onClick={onOfferOpen}
                    variant="outlined"
                    color="primary"
                >Add New Offer</Button>
                <Button
                    style={{marginLeft: 12}}
                    variant="contained"
                    color="primary"
                >Send Offer</Button>
            </div>
            <NewOffer open={isOfferOpen} onClose={onOfferClose} />
        </div>
    );
};
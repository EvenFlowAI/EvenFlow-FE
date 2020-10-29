import React, {useEffect, useState} from 'react';
import {Button, CircularProgress, Grid} from "@material-ui/core";
import {useModal, useSCs} from "../../../utils/hooks";
import {NewOffer} from "./NewOffer";
import {useDispatch, useSelector} from "react-redux";
import {loadOffers} from "../../../store/reducers/offers/actions";
import {RootState} from "../../../store/rootReducer";
import {OfferPlate} from "./OfferPlate";
import {IOffer} from "../../../store/reducers/offers/types";

export const ActiveOffers = () => {
    const {onOpen: onOfferOpen, onClose: onOfferClose, isOpen: isOfferOpen} = useModal();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [editedItem, setEditedItem] = useState<IOffer|undefined>(undefined);
    const [offers, offersLoading, pageData] = useSelector((state: RootState) => [
        state.offers.offersList,
        state.offers.offersLoading,
        state.offers.offersPageData
    ])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadOffers(selectedSC.id));
        }
    }, [selectedSC, dispatch, pageData]);

    const handleNewOffer = () => {
        setEditedItem(undefined);
        onOfferOpen();
    }

    const handleEdit = (offer: IOffer) => () => {
        setEditedItem(offer);
        onOfferOpen();
    }

    return (
        <div>
            <div style={{textAlign: "right"}}>
                <Button
                    onClick={handleNewOffer}
                    variant="outlined"
                    color="primary"
                >Add New Offer</Button>
                <Button
                    style={{marginLeft: 12}}
                    variant="contained"
                    color="primary"
                >Send Offer</Button>
            </div>
            <Grid container spacing={2} style={{marginTop: 16}}>
                {offersLoading
                    ? <Grid item xs={12} style={{textAlign: "center"}}><CircularProgress /></Grid>
                    : offers.map(offer => {
                    return <Grid key={offer.id} item xs={12} sm={6} md={4}>
                        <OfferPlate offer={offer} onClick={handleEdit} />
                    </Grid>
                })}
            </Grid>
            <NewOffer open={isOfferOpen} payload={editedItem} onClose={onOfferClose} />
        </div>
    );
};
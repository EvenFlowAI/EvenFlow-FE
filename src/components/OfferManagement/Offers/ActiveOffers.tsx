import React, {useEffect, useState} from 'react';
import {Button, CircularProgress, Grid} from "@material-ui/core";
import {useModal, useSCs} from "../../../utils/hooks";
import {NewOffer} from "./NewOffer";
import {useDispatch, useSelector} from "react-redux";
import {loadOffers} from "../../../store/reducers/offers/actions";
import {RootState} from "../../../store/rootReducer";
import {OfferPlate} from "./OfferPlate";
import {EOfferStatus, IOffer} from "../../../store/reducers/offers/types";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {SendOffer} from "./SendOffer";

export const ActiveOffers = () => {
    const {onOpen, onClose, isOpen} = useModal();
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

    useEffect(() => {
        if (editedItem) {
            const nItem: IOffer|undefined = offers.find(i => i.id === editedItem.id);
            if (editedItem.status === EOfferStatus.None && !nItem) {
                // Assume offer is archived
                setEditedItem({...editedItem, status: EOfferStatus.Archived});
            } else if (editedItem.status === EOfferStatus.Archived
                && nItem?.status === EOfferStatus.None) {
                setEditedItem({...editedItem, status: EOfferStatus.None});
            }
        }
    }, [offers, editedItem]);

    const handleNewOffer = () => {
        setEditedItem(undefined);
        onOpen();
    }

    const handleEdit = (offer: IOffer) => () => {
        setEditedItem(offer);
        onOpen();
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
                    onClick={onOfferOpen}
                    style={{marginLeft: 12}}
                    variant="contained"
                    color="primary"
                >Send Offer</Button>
            </div>
            <Grid container spacing={2} style={{marginTop: 16}}>
                {offersLoading
                    ? <Grid item xs={12} style={{textAlign: "center"}}><CircularProgress /></Grid>
                    : offers.length ? offers.map(offer => {
                    return <Grid key={offer.id} item xs={12} sm={6} md={4}>
                        <OfferPlate offer={offer} onClick={handleEdit} />
                    </Grid>
                }) : <NoItemsLoading items={offers} label={"There are no active offers."} />}
            </Grid>
            <NewOffer open={isOpen} payload={editedItem} onClose={onClose} />
            <SendOffer open={isOfferOpen} onClose={onOfferClose} />
        </div>
    );
};
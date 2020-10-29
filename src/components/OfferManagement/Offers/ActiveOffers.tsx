import React, {useEffect} from 'react';
import {Button, CircularProgress, Grid} from "@material-ui/core";
import {useModal, useSCs} from "../../../utils/hooks";
import {NewOffer} from "./NewOffer";
import {useDispatch, useSelector} from "react-redux";
import {loadOffers} from "../../../store/reducers/offers/actions";
import {RootState} from "../../../store/rootReducer";
import {OfferPlate} from "./OfferPlate";

export const ActiveOffers = () => {
    const {onOpen: onOfferOpen, onClose: onOfferClose, isOpen: isOfferOpen} = useModal();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
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
            <Grid container spacing={2} style={{marginTop: 16}}>
                {offersLoading
                    ? <Grid item xs={12} style={{textAlign: "center"}}><CircularProgress /></Grid>
                    : offers.map(offer => {
                    return <Grid item xs={4}>
                        <OfferPlate offer={offer} key={offer.id} />
                    </Grid>
                })}
            </Grid>
            <NewOffer open={isOfferOpen} onClose={onOfferClose} />
        </div>
    );
};
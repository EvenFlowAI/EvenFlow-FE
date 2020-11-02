import React, {useEffect} from 'react';
import {useModal, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadArchivedOffers, loadOffers} from "../../../store/reducers/offers/actions";
import {Grid} from "@material-ui/core";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {OfferPlate} from "./OfferPlate";

export const ArchiveOffers = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [offers, offersLoading, pageData] = useSelector((state: RootState) => [
        state.offers.archivedOffersList,
        state.offers.archivedOffersLoading,
        state.offers.archivedOffersPageData
    ]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadArchivedOffers(selectedSC.id));
        }
    }, [selectedSC, dispatch, pageData]);

    return <Grid container spacing={2}>
        <NoItemsLoading items={offers} loading={offersLoading} label={"There are no active offers."} />
        {offers.map(offer => {
            return <Grid key={offer.id} item xs={12} sm={6} md={4}>
                <OfferPlate offer={offer} onClick={() => () => {}} />
            </Grid>
        })}
    </Grid>
};
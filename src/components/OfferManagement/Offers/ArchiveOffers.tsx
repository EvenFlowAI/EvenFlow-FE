import React, {useEffect, useState} from 'react';
import {useModal, usePagination, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadArchivedOffers, setArchivedOffersPageData} from "../../../store/reducers/offers/actions";
import {Grid, TablePagination} from "@material-ui/core";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {OfferPlate} from "./OfferPlate";
import {EOfferStatus, IOffer} from "../../../store/reducers/offers/types";
import {NewOffer} from "./NewOffer";
import {defaultRowsPerPageOptions} from "../../../config/config";

export const ArchiveOffers = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [offers, offersLoading, pageData, count] = useSelector((state: RootState) => [
        state.offers.archivedOffersList,
        state.offers.archivedOffersLoading,
        state.offers.archivedOffersPageData,
        state.offers.archivedOffersPaging.numberOfRecords
    ]);
    const [editedItem, setEditedItem] = useState<IOffer|undefined>(undefined);
    const {changePage, changeRowsPerPage} = usePagination(
        s => s.offers.archivedOffersPageData,
        setArchivedOffersPageData
    );

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadArchivedOffers(selectedSC.id));
        }
    }, [selectedSC, dispatch, pageData]);

    useEffect(() => {
        if (editedItem) {
            const nItem: IOffer|undefined = offers.find(i => i.id === editedItem.id);
            if (editedItem.status === EOfferStatus.Archived && !nItem) {
                // Assume offer is archived
                setEditedItem({...editedItem, status: EOfferStatus.None});
            } else if (editedItem.status === EOfferStatus.None
                && nItem?.status === EOfferStatus.Archived) {
                setEditedItem({...editedItem, status: EOfferStatus.Archived});
            }
        }
    }, [offers, editedItem]);

    const handleEdit = (offer: IOffer) => () => {
        setEditedItem(offer);
        onOpen();
    }

    return <Grid container spacing={2}>
        <NoItemsLoading items={offers} loading={offersLoading} label={"There are no active offers."} />
        {offers.map(offer => {
            return <Grid key={offer.id} item xs={12} sm={6} md={4}>
                <OfferPlate offer={offer} onClick={handleEdit} />
            </Grid>
        })}
        {count > pageData.pageSize ? <Grid item xs={12}>
            <TablePagination
                component="div"
                count={count}
                page={pageData.pageIndex}
                onChangePage={changePage}
                onChangeRowsPerPage={changeRowsPerPage}
                rowsPerPage={pageData.pageSize}
                rowsPerPageOptions={defaultRowsPerPageOptions}
            />
        </Grid> : null}
        <NewOffer open={isOpen} payload={editedItem} archive onClose={onClose} />
    </Grid>
};
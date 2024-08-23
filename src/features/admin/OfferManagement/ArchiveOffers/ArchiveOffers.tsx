import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {loadArchivedOffers, setArchivedOffersPageData} from "../../../../store/reducers/offers/actions";
import {Grid, TablePagination} from "@mui/material";
import {NoItemsLoading} from "../../../../components/wrappers/NoItemsLoading/NoItemsLoading";
import {OfferPlate} from "../OfferPlate/OfferPlate";
import {EOfferStatus, IOffer} from "../../../../store/reducers/offers/types";
import {OfferModal} from "../OfferModal/OfferModal";
import {defaultRowsPerPageOptions} from "../../../../config/config";
import {useModal} from "../../../../hooks/useModal/useModal";
import {usePagination} from "../../../../hooks/usePaginations/usePaginations";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

export const ArchiveOffers = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {
        archivedOffersList: offers,
        archivedOffersLoading: offersLoading,
        archivedOffersPageData: pageData,
        archivedOffersPaging: {numberOfRecords: count}
    } = useSelector((state: RootState) => state.offers)
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
                onPageChange={changePage}
                onRowsPerPageChange={changeRowsPerPage}
                rowsPerPage={pageData.pageSize}
                rowsPerPageOptions={defaultRowsPerPageOptions}
            />
        </Grid> : null}
        <OfferModal open={isOpen} payload={editedItem} archive onClose={onClose} />
    </Grid>
};
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {IRecall} from "../../../../store/reducers/recall/types";
import {Table} from "../../../../components/tables/Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import {
    deleteRecall,
    loadRecalls,
    setRecallOrder,
    setRecallPageData,
} from "../../../../store/reducers/recall/actions";
import {IOrder, TableRowDataType} from "../../../../types/types";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";
import {usePagination} from "../../../../hooks/usePaginations/usePaginations";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

type TRecallTableProps = {
    onOpenModal: () => void;
    currentItem: IRecall|null;
    setCurrentItem: Dispatch<SetStateAction<IRecall|null>>;
}

const RecallTable: React.FC<React.PropsWithChildren<React.PropsWithChildren<TRecallTableProps>>> = ({onOpenModal, currentItem, setCurrentItem}) => {
    const {recalls, recallsCount, order, searchTerm} = useSelector((state: RootState) => state.recalls);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

    const dispatch = useDispatch();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.recalls.recallPageData,
        setRecallPageData
    );

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadRecalls(selectedSC.id))
        }
    }, [selectedSC, pageIndex, pageSize, order, searchTerm])

    const rowData: TableRowDataType<IRecall>[] = [
        {
            header: "NHTSA Campaign",
            val: el => el.recallCampaignNumber,
            orderId: "CampaignNumber"
        },
        {
            header: "OEM Program",
            val: el => el.oemProgram,
            orderId: "OemProgram"
        },
        {
            header: "Make",
            val: el => el.make?.name ?? '',
            orderId: "Make"
        },
        {
            header: "Model",
            val: el => el.models ? el.models.map(el => el.name).join(', ') : el.model
        },
        {
            header: "From",
            val: el => el.yearFrom?.toString() ?? '',
            orderId: "YearFrom"
        },
        {
            header: "To",
            val: el => el.yearTo?.toString() ?? '',
            orderId: "YearTo"
        },
        {
            header: "Recall Component",
            val: el => el.recallComponent,
            orderId: "RecallComponent"
        },
        {
            header: "Op Code",
            val: el => el.serviceRequest?.name ?? '',
            orderId: "OpCode"
        },
    ]

    const openMenu = (el: IRecall) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentItem(el);
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IRecall) => {
        return (
            <IconButton onClick={openMenu(el)} size="large">
                <MoreHoriz />
            </IconButton>
        );
    }

    const openEdit = () => {
        setAnchorEl(null);
        onOpenModal();
    }

    const handleRemove = async () => {
        if (!currentItem) {
            showError("Make is not chosen");
        } else {
            if (selectedSC) {
                try {
                    dispatch(deleteRecall(currentItem.id, selectedSC.id, showError))
                    setCurrentItem(null);
                } catch (e) {
                    showError(e);
                }
            }
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (!currentItem) {
            showError("Recall is not chosen");
        } else {
            const itemName = currentItem.recallCampaignNumber?.length < 25
                ? currentItem.recallCampaignNumber
                : currentItem.recallCampaignNumber.slice(0, 24).concat('...')
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove Recall ${itemName}?`,
                onConfirm: handleRemove
            });
        }
    }

    const onSort = (o: IOrder<IRecall>) => () => {
        dispatch(setRecallOrder(o))
    }

    const onMenuClose = () => {
        setAnchorEl(null)
        setCurrentItem(null)
    }

    return (
        <div>
            <Table<IRecall>
                data={recalls}
                index={"id"}
                isAscending={order.isAscending}
                order={order?.orderBy}
                onSort={onSort}
                rowData={rowData}
                actions={tableActions}
                rowsPerPage={pageSize}
                page={pageIndex}
                onChangePage={changePage}
                onChangeRowsPerPage={changeRowsPerPage}
                count={recallsCount}
                hidePagination={recallsCount < 11}
            />
            <Menu
                open={Boolean(anchorEl)}
                onClose={onMenuClose}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={openEdit}>Edit</MenuItem>
                <MenuItem onClick={askRemove}>Remove</MenuItem>
            </Menu>
        </div>
    );
};

export default RecallTable;
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {TableRowDataType} from "../../UI/types";
import {IRecall} from "../../../store/reducers/recall/types";
import {Table} from "../../UI/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {useConfirm, useException, useModal, usePagination, useSCs} from "../../../utils/hooks";
import {BaseModal, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {deleteRecall, loadRecalls, setRecallPageData} from "../../../store/reducers/recall/actions";

type TRecallTableProps = {
    onOpenModal: () => void;
    currentItem: IRecall|null;
    setCurrentItem: Dispatch<SetStateAction<IRecall|null>>;
}

const RecallSummary: React.FC<DialogProps & {summary: string}> = ({summary, open, onClose}) => {
    return <BaseModal open={open} onClose={onClose} width={600}>
        <DialogTitle onClose={onClose}>Recall Summary</DialogTitle>
        <DialogContent style={{marginBottom: 20}}>
            {summary}
        </DialogContent>
    </BaseModal>
}

const RecallTable: React.FC<TRecallTableProps> = ({onOpenModal, currentItem, setCurrentItem}) => {
    const {recalls, recallsCount} = useSelector((state: RootState) => state.recalls);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

    const dispatch = useDispatch();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const {isOpen: isSummaryOpen, onOpen: onSummaryOpen, onClose: onSummaryClose} = useModal();
    const {changeRowsPerPage,changePage,pageIndex,pageSize} = usePagination(
        (s: RootState) => s.recalls.recallPageData,
        setRecallPageData
    );

    useEffect(() => {
        if (selectedSC) dispatch(loadRecalls(selectedSC.id))
    }, [selectedSC, pageIndex, pageSize])

    const onSummaryClick = (item: IRecall) => {
        setCurrentItem(item);
        onSummaryOpen();
    }

    const rowData: TableRowDataType<IRecall>[] = [
        {
            header: "Recall Campaign Number",
            val: el => el.recallCampaignNumber
        },
        {
            header: "Make",
            val: el => el.make?.name ?? ''
        },
        {
            header: "Model",
            val: el => el.model?.name ?? ''
        },
        {
            header: "Year From",
            val: el => el.yearRange?.from?.toString() ?? '',
        },
        {
            header: "Year To",
            val: el => el.yearRange?.to?.toString() ?? '',
        },
        {
            header: "Recall Component",
            val: el => el.recallComponent
        },
        {
            header: "Recall Summary",
            val: el => <Button
                variant="text"
                style={{textTransform: "none", textDecoration: "underline"}}
                onClick={() => onSummaryClick(el)}>
                See Recall Summary
            </Button>
        },
        {
            header: "Ops Code Assignment",
            val: el => el.serviceRequest?.name ?? '',
        },
        {
            header: "Part Lead Time (days)",
            val: el => el.partLeadDaysCount?.toString() ?? '',
        },
        {
            header: "Daily Parts",
            val: el => el.dailyPartsCount?.toString() ?? ''
        }
    ]

    const openMenu = (el: IRecall) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentItem(el);
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IRecall) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
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

    return (
        <div>
            <Table<IRecall>
                data={recalls}
                index={"id"}
                rowData={rowData}
                actions={tableActions}
                rowsPerPage={pageSize}
                page={pageIndex}
                onChangePage={changePage}
                onChangeRowsPerPage={changeRowsPerPage}
                count={recallsCount}
                hidePagination={recallsCount < pageSize}
            />
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => {setAnchorEl(null);}}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={openEdit}>Edit</MenuItem>
                <MenuItem onClick={askRemove}>Remove</MenuItem>
            </Menu>
            {currentItem && <RecallSummary open={isSummaryOpen} onClose={onSummaryClose} summary={currentItem.recallSummary}/>}
        </div>
    );
};

export default RecallTable;
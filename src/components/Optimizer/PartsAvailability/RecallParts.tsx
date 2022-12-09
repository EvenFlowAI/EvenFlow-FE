import React, {useState} from 'react';
import {TableRowDataType} from "../../UI/types";
import {IRecall} from "../../../store/reducers/recall/types";
import {Table} from "../../UI/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreHoriz} from "@material-ui/icons";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../utils/hooks";

const rowData: TableRowDataType<IRecall>[] = [
    {
        header: "Recall Campaign Number",
        val: el => el.recallCampaignNumber
    },
    {
        header: "Make",
        val: el => el.make
    },
    {
        header: "Model",
        val: el => el.model
    },
    {
        header: "Year",
        val: el => el.year.toString()
    },
    {
        header: "Recall Component",
        val: el => el.recallComponent
    },
    {
        header: "Recall Summary",
        val: el => el.recallSummary
    },
    {
        header: "Ops Code Assignment",
        val: el => el.serviceRequestCode
    },
    {
        header: "Part Lead Time (days)",
        val: el => el.partLeadDaysCount.toString()
    },
    {
        header: "Daily Parts",
        val: el => el.dailyPartsCount.toString()
    }
]

const RecallParts = () => {
    const {recalls} = useSelector((state: RootState) => state.recalls);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentItem, setCurrentItem] = useState<IRecall | null>(null);

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const {isOpen, onOpen, onClose} = useModal();

    const openMenu = (el: IRecall) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentItem(el);
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IRecall) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }

    const onError = (e: string) => {
        showError(e)
    }

    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }

    const handleRemove = async () => {
        if (!currentItem) {
            showError("Make is not chosen");
        } else {
            try {
                // todo request
                // showMessage("Removed");
                setCurrentItem(null);
            } catch (e) {
                showError(e);
            }
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (!currentItem) {
            showError("Recall is not chosen");
        } else {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove Recall ${currentItem.recallCampaignNumber}?`,
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
            />
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => {setAnchorEl(null);}}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={openEdit}>Edit</MenuItem>
                <MenuItem onClick={askRemove}>Remove</MenuItem>
            </Menu>
        </div>
    );
};

export default RecallParts;
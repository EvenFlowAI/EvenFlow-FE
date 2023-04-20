import React, {useState} from 'react';
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {Table} from "../../UI/Table";
import {TabPanel} from "@material-ui/lab";
import {TableRowDataType} from "../../UI/types";
import {ICategory} from "../../../store/reducers/categories/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {MoreHoriz} from "@material-ui/icons";
import {deleteCategoryById} from "../../../store/reducers/categories/actions";
import {useConfirm, useException, useMessage, useModal} from "../../../utils/hooks";
import AddServiceCategory from "../../Modals/AddServiceCategory/AddServiceCategory";

const RowData: TableRowDataType<ICategory>[] = [
    {val: (el: ICategory) => el.name, header: "Service Category Name",  width: 300},
    {val: (el: ICategory) => el.orderIndex?.toString() ?? '', header: "Order Index", align: 'center', width: 150},
];

const CategoriesTablePage: React.FC<{tabValue: string}> = ({tabValue}) => {
    const { categories, isLoading } = useSelector((state: RootState) => state.categories);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentItem, setCurrentItem] = useState<ICategory | null>(null);
    const {isOpen, onOpen, onClose} = useModal();

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();

    const onOpenAdd = async () => {
        await setCurrentItem(null);
        await onOpen();
    }

    const openMenu = (el: ICategory) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentItem(el);
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: ICategory) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }

    const handleRemove = async () => {
        if (!currentItem) {
            showError("Make is not chosen");
        } else {
            try {
                if (currentItem.id) dispatch(deleteCategoryById(currentItem.id))
                showMessage("Category removed");
                setCurrentItem(null);
            } catch (e) {
                showError(e);
            }
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (!currentItem) {
            showError("Category is not chosen");
        } else {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove category ${currentItem.name}?`,
                onConfirm: handleRemove
            });
        }
    }

    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }

    return (
        <TabPanel style={{width: "100%", padding: "24px 0"}} value={tabValue}>
            <div style={{display: "flex", alignItems: "center", justifyContent: 'flex-end', marginBottom: 20}}>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpenAdd}
                    variant="contained">
                    Add Service Category
                </Button>
            </div>
            <Table
                data={categories}
                index="name"
                rowData={RowData}
                actions={tableActions}
                hidePagination
                isLoading={isLoading}
            />
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => {setAnchorEl(null);}}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={openEdit}>Edit</MenuItem>
                <MenuItem onClick={askRemove}>Remove</MenuItem>
            </Menu>
            <AddServiceCategory open={isOpen} editingItem={currentItem} onClose={onClose}/>
        </TabPanel>
    );
};

export default CategoriesTablePage;
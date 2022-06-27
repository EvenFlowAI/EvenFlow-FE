import React, {useEffect, useState} from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {TabContext, TabPanel} from "@material-ui/lab";
import {TabList} from "../../UI/Tabs";
import {Button, IconButton, Menu, MenuItem, Tab} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {deleteCategoryById, loadCategoriesByPage, setCategoriesPage} from "../../../store/reducers/categories/actions";
import {RootState} from "../../../store/rootReducer";
import {TableRowDataType} from "../../UI/types";
import {MoreHoriz} from "@material-ui/icons";
import {ICategory} from "../../../store/reducers/categories/types";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import {Table} from "../../UI/Table";
import AddServiceCategory from "../../Modals/AddServiceCategory/AddServiceCategory";

const RowData: TableRowDataType<ICategory>[] = [
    {val: (el: ICategory) => el.name, header: "Service Category Name",  width: 300},
    {val: (el: ICategory) => el.orderIndex?.toString() ?? '', header: "Order Index", align: 'center', width: 150},
];

const ServiceOpsCodesMapping = () => {
    const { categories, isLoading } = useSelector((state: RootState) => state.categories);
    const [selectedTab, setTab] = useState<string>("0");
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentItem, setCurrentItem] = useState<ICategory | null>(null);

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();
    const {isOpen, onOpen, onClose} = useModal();

    useEffect(() => {
        selectedSC && dispatch(loadCategoriesByPage());
    }, [selectedSC])

    const handleTabChange = async (e: React.ChangeEvent<{}>, tab: string) => {
        setTab(tab);
        await dispatch(setCategoriesPage(+tab));
        await dispatch(loadCategoriesByPage());
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
                showMessage("Removed");
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
                title: `Remove category ${currentItem.name}?`,
                onConfirm: handleRemove
            });
        }
    }

    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }

    const onOpenAdd = async () => {
        await setCurrentItem(null);
        await onOpen();
    }

    return (
            <TabContext value={selectedTab}>
            <TitleContainer title="Service Ops Codes Mapping" pad />
            <TabList
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="primary"
            >
                <Tab label="Booking Flow (Page 1)" value="0"/>
                <Tab label="Booking Flow (Page 2)" value="1"/>
            </TabList>
            <TabPanel style={{width: "100%", padding: "24px 0"}} value="0">
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
            </TabPanel>
            <TabPanel style={{width: "100%", padding: "24px 0"}} value="1">
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
            </TabPanel>
                <AddServiceCategory open={isOpen} editingItem={currentItem} onClose={onClose}/>
        </TabContext>
    );
};

export default ServiceOpsCodesMapping;
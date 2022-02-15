import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useConfirm, useException, useMessage, useModal, useSCs} from "../../../../../utils/hooks";
import {deleteMake, loadMakes, setCurrentMake} from "../../../../../store/reducers/vehicleDetails/actions";
import {RootState} from "../../../../../store/rootReducer";
import {Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {TableRowDataType} from "../../../../UI/types";
import {IMake} from "../../../../../api/types";
import {Table} from "../../../../UI/Table";
import {MoreHoriz} from "@material-ui/icons";
import AddMakeModel from "../../../../Modals/AddMakeModel/AddMakeModel";

const RowData: TableRowDataType<IMake>[] = [
    {val: (el: IMake) => <span style={{fontWeight: 'bold'}}>{el.name}</span>, header: "Make"},
    {val: (el: IMake) => el.models.join(', '), header: "Model"},
];

const MakesModelsTable = () => {
    const { makes, currentMake, isLoading } = useSelector((state: RootState) => state.vehicleDetails);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [tableData, setTableData] = useState<IMake[]>([]);
    const { selectedSC } = useSCs();
    const showMessage = useMessage();
    const showError = useException();
    const dispatch = useDispatch();
    const {askConfirm} = useConfirm();
    const {onOpen, onClose, isOpen} = useModal();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadMakes(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (makes) {
            setTableData(() => {
                const formattedData: IMake[] = [];
                makes.forEach(make => {
                    const formattedMake = {...make};
                    if (formattedMake.name.length > 30) {
                        formattedMake.name = formattedMake.name.slice(0, 26).concat('...');
                    }
                    const formattedModels: string[] = [];
                    formattedMake.models.forEach(model => {
                        if (model.length > 30) {
                            formattedModels.push(model.slice(0, 26).concat('...'));
                        } else {
                            formattedModels.push(model);
                        }
                    })
                    formattedMake.models = formattedModels;
                    formattedData.push(formattedMake);
                })
                return formattedData;
            })
        }
    }, [makes])

    const openMenu = (el: IMake) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(setCurrentMake(el));
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IMake) => {
        return <IconButton onClick={openMenu(el)}>
            <MoreHoriz />
        </IconButton>;
    }

    const handleRemove = async () => {
        if (!currentMake) {
            showError("Make is not chosen");
        } else {
            try {
                if (currentMake.id) dispatch(deleteMake(currentMake.id))
                showMessage("Removed");
                dispatch(setCurrentMake(null));
            } catch (e) {
                showError(e);
            }
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (!currentMake) {
            showError("Make is not chosen");
        } else {
            askConfirm({
                isRemove: true,
                title: `Remove make ${currentMake.name}?`,
                onConfirm: handleRemove
            });
        }
    }

    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }

    return (
        <div>
            <div style={{display: "flex", alignItems: "center", justifyContent: 'flex-end', marginBottom: 20}}>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpen}
                    variant="contained">
                    Add Make And Model
                </Button>
            </div>
            <Table data={tableData} index="name" rowData={RowData} actions={tableActions} hidePagination isLoading={isLoading}/>
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => {setAnchorEl(null);}}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={openEdit}>Edit</MenuItem>
                <MenuItem onClick={askRemove}>Remove</MenuItem>
            </Menu>
            <AddMakeModel open={isOpen} onClose={onClose} isEditing={Boolean(currentMake)}/>
        </div>
    );
};

export default MakesModelsTable;
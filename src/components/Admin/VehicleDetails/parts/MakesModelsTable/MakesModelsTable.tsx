import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
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
import {autocompleteRender} from "../../../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {updateDefaultMake} from "../../../../../store/reducers/serviceCenters/actions";

const useStyles = makeStyles(() => ({
    wrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 20
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "capitalize",
        marginRight: 10
    },
    button: {
        marginLeft: 20
    }
}))
import {truncateMakes} from "../../../../../utils/utils";

const RowData: TableRowDataType<IMake>[] = [
    {val: (el: IMake) => <span style={{fontWeight: 'bold'}}>{el.name}</span>, header: "Make"},
    {val: (el: IMake) => el.models.join(', '), header: "Model"},
];

const MakesModelsTable = () => {
    const {makes, currentMake, isLoading} = useSelector((state: RootState) => state.vehicleDetails);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [tableData, setTableData] = useState<IMake[]>([]);
    const [selectedMake, setSelectedMake] = useState<IMake|null>(null);

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {selectedSC} = useSCs();
    const {askConfirm} = useConfirm();
    const {onOpen, onClose, isOpen} = useModal();
    const classes = useStyles();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadMakes(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (makes) setTableData(truncateMakes(makes))
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
                showMessage("Make removed");
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
                title: currentMake.id === selectedSC?.defaultVehicleMakeId
                    ? `The Make ${currentMake.name} is selected as a default. Please confirm that you want to remove make ${currentMake.name}`
                    : `Please confirm that you want to remove make ${currentMake.name}`,
                onConfirm: handleRemove
            });
        }
    }

    const openEdit = () => {
        setAnchorEl(null);
        onOpen();
    }
    const onMakeChange = (e: ChangeEvent<{}>, value: IMake|null) => {
        if (selectedSC) dispatch(updateDefaultMake(selectedSC.id, value?.id ?? null, showError))
    }

    return (
        <div>
            <div className={classes.wrapper}>
                <div className={classes.title}>Default Make:</div>
                <Autocomplete
                    style={{marginRight: 20, width: 300}}
                    loading={isLoading}
                    value={selectedMake}
                    options={makes}
                    getOptionSelected={(o, v) => o.id === v.id}
                    getOptionLabel={o => o.name}
                    onChange={onMakeChange}
                    renderInput={autocompleteRender({
                        label: "",
                        placeholder: 'Select make'
                    })}
                />
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
                onClose={() => setAnchorEl(null)}
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
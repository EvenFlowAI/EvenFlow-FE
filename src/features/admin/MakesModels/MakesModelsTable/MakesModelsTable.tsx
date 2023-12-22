import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteMake, setCurrentMake} from "../../../../store/reducers/vehicleDetails/actions";
import {RootState} from "../../../../store/rootReducer";
import {IconButton, Menu, MenuItem} from "@material-ui/core";
import {IMake} from "../../../../api/types";
import {Table} from "../../../../components/tables/Table/Table";
import {MoreHoriz} from "@material-ui/icons";
import {TableRowDataType, TCallback} from "../../../../types/types";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {truncateMakes} from "./utils";

const RowData: TableRowDataType<IMake>[] = [
    {val: (el: IMake) => <span style={{fontWeight: 'bold'}}>{el.name}</span>, header: "Make"},
    {val: (el: IMake) => el.models.join(', '), header: "Model"},
];

export const MakesModelsTable: React.FC<{onOpen: TCallback}> = ({onOpen}) => {
    const {makes, currentMake, isLoading} = useSelector((state: RootState) => state.vehicleDetails);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [tableData, setTableData] = useState<IMake[]>([]);

    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();
    const {selectedSC} = useSCs();
    const {askConfirm} = useConfirm();

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

    return (
        <div>
            <Table
                data={tableData}
                index="name"
                rowData={RowData}
                actions={tableActions}
                hidePagination
                isLoading={isLoading}/>
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={openEdit}>Edit</MenuItem>
                <MenuItem onClick={askRemove}>Remove</MenuItem>
            </Menu>
        </div>
    );
};
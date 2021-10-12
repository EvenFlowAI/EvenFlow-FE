import React, {Dispatch, SetStateAction, useCallback} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../BaseModal";
import {DialogProps} from "../../../types";
import {TableRowDataType} from "../../../../UI/types";
import {IPackageByQuery} from "../../../../../api/types";
import {Table} from "../../../../UI/Table";
import Checkbox from "../../../../UI/Checkbox";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {Button} from "@material-ui/core";

type TAssignOpsCodeModalProps = DialogProps & {
    selectedPackages: number[];
    setSelectedPackages: Dispatch<SetStateAction<number[]>>;
}

export const existingPackagesTableData: TableRowDataType<IPackageByQuery>[] = [
    {header: "Package Name", val: el => el.name, width: '90%'}
]

const ExistingPackages: React.FC<TAssignOpsCodeModalProps> = (props) => {
    const { packages } = useSelector((state: RootState) => state.packages);

    const handleSelect = useCallback((el: IPackageByQuery) => {
        props.setSelectedPackages(prev => {
            return  prev.includes(+el.id) ? prev.filter(item => item !== el.id) : [...prev, el.id]
        });
    }, [props.setSelectedPackages])

    const preActions = useCallback((el: IPackageByQuery) => {
        return <Checkbox color="primary" checked={props.selectedPackages.includes(+el.id)} onChange={() => handleSelect(el)} />
    }, [props.selectedPackages, handleSelect])

    return (
        <BaseModal {...props} width={400}>
            <DialogTitle onClose={props.onClose}>Add Existing Packages</DialogTitle>
            <DialogContent>
                <Table<IPackageByQuery>
                    superCompact
                    data={packages}
                    index="id"
                    smallHeaderFont
                    startActions={preActions}
                    hideHeader
                    rowData={existingPackagesTableData}
                    hidePagination
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    Close
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default ExistingPackages;
import React, {Dispatch, SetStateAction, useCallback} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../../../components/modals/BaseModal/types";
import {IPackageByQuery} from "../../../../../../api/types";
import {Table} from "../../../../../../components/tables/Table/Table";
import Checkbox from "../../../../../../components/formControls/Checkbox/Checkbox";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {Button} from "@mui/material";
import {TableRowDataType} from "../../../../../../types/types";

type TAssignOpsCodeModalProps = DialogProps & {
    selectedPackages: number[];
    setSelectedPackages: Dispatch<SetStateAction<number[]>>;
}

export const existingPackagesTableData: TableRowDataType<IPackageByQuery>[] = [
    {header: "Package Name", val: el => el.name, width: '90%'}
]

const ExistingPackagesModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TAssignOpsCodeModalProps>>> = ({selectedPackages, setSelectedPackages, ...props}) => {
    const { packages } = useSelector((state: RootState) => state.packages);

    const handleSelect = useCallback((el: IPackageByQuery) => {
        setSelectedPackages(prev => {
            return  prev.includes(+el.id) ? prev.filter(item => item !== el.id) : [...prev, el.id]
        });
    }, [setSelectedPackages])

    const preActions = useCallback((el: IPackageByQuery) => {
        return <Checkbox color="primary" checked={selectedPackages.includes(+el.id)} onChange={() => handleSelect(el)} />
    }, [selectedPackages, handleSelect])

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

export default ExistingPackagesModal;
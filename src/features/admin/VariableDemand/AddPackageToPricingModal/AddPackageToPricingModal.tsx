import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Table} from "../../../../components/tables/Table/Table";
import {Button} from "@mui/material";
import {TNewPackagesToPricing} from "../../../../store/reducers/pricingSettings/types";
import {addPackageToPricing} from "../../../../store/reducers/pricingSettings/actions";
import {IPackageOptionShort} from "../../../../store/reducers/packages/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import Checkbox from "../../../../components/formControls/Checkbox/Checkbox";
import {TableRowDataType} from "../../../../types/types";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const tableData: TableRowDataType<IPackageOptionShort>[] = [
    {header: "PACKAGE LEVEL", val: el => el.maintenancePackageOptionName ? el.maintenancePackageOptionName.toString() : '-', align: "left"},
    {header: "PACKAGE ID", val: el => el.maintenancePackageId.toString(), align: "left"},
    {header: "PACKAGE NAME", val: el => el.maintenancePackageName, align: "left"},
]

const AddPackageToPricingModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = (props) => {
    const {mpOptionsList, mpPricingSettings} = useSelector((state: RootState) => state.pricingSettings);
    const [selectedPackages, setSelectedPackages] = useState<IPackageOptionShort[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<IPackageOptionShort[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.open) {
            setFilteredPackages(mpOptionsList);
            setSelectedPackages(() => {
                return mpOptionsList.filter(el => mpPricingSettings.map(p => p.maintenancePackageOptionId).includes(el.maintenancePackageOptionId))
            })
        }
    }, [mpOptionsList, mpPricingSettings, props.open]);

    const handleAddPackage = () => {
        if (selectedSC && selectedPackages.length) {
            try {
                setIsSaving(true)
                const data: TNewPackagesToPricing = {
                    serviceCenterId: selectedSC.id,
                    maintenancePackageOptionIds: selectedPackages
                        .map(item => item.maintenancePackageOptionId)
                        .filter(item => !mpPricingSettings.find(el => el.maintenancePackageOptionId === item)),
                }
                dispatch(addPackageToPricing(data))
            } catch (e) {
                showError(e);
            } finally {
                setIsSaving(false);
            }
        }
    }

    const handleClose = () => {
        setSelectedPackages([]);
        setIsSaving(false);
        props.onClose();
    }

    const handleSave = () => {
        handleAddPackage();
        handleClose();
    }

    const handleSelect = (el: IPackageOptionShort) => {
        setSelectedPackages(prev => {
            return prev.find(item => item.maintenancePackageOptionId === el.maintenancePackageOptionId)
                ? prev.filter(item => item.maintenancePackageOptionId !== el.maintenancePackageOptionId)
                : [...prev, el]
        })
    }

    const preActions = useCallback((el: IPackageOptionShort) => {
        return <Checkbox
            color="primary"
            disabled={Boolean(mpPricingSettings.find(item => item.maintenancePackageOptionId === el.maintenancePackageOptionId))}
            checked={Boolean(selectedPackages.find(item => item.maintenancePackageOptionId === el.maintenancePackageOptionId))}
            onChange={() => handleSelect(el)} />
    }, [handleSelect, selectedPackages])

    return (
        <BaseModal {...props} width={650} onClose={handleClose}>
            <DialogTitle onClose={handleClose}>Add Maintenance Package</DialogTitle>
            <DialogContent>
                <Table<IPackageOptionShort>
                    data={filteredPackages}
                    index="maintenancePackageOptionId"
                    smallHeaderFont
                    startActions={preActions}
                    hidePagination
                    compact
                    rowData={tableData}
                    isLoading={isSaving}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="info">
                    Close
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default AddPackageToPricingModal;
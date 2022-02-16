import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Table} from "../../UI/Table";
import {Button} from "@material-ui/core";
import {TNewPackagesToPricing} from "../../../store/reducers/pricingSettings/types";
import {addPackageToPricing} from "../../../store/reducers/pricingSettings/actions";
import {IPackageOptionShort} from "../../../store/reducers/packages/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useException, useSCs} from "../../../utils/hooks";
import {DialogProps} from "../types";
import {TableRowDataType} from "../../UI/types";
import Checkbox from "../../UI/Checkbox";

const tableData: TableRowDataType<IPackageOptionShort>[] = [
    {header: "PACKAGE LEVEL", val: el => el.maintenancePackageOptionName.toString(), align: "left"},
    {header: "PACKAGE ID", val: el => el.maintenancePackageId.toString(), align: "left"},
    {header: "PACKAGE NAME", val: el => el.maintenancePackageName, align: "left"},
]

const AddPackageToPricingSettings: React.FC<DialogProps> = (props) => {
    const {mpOptionsList, mpPricingSettings} = useSelector((state: RootState) => state.pricingSettings);
    const [selectedPackages, setSelectedPackages] = useState<IPackageOptionShort[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<IPackageOptionShort[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const showError = useException();
    const dispatch = useDispatch();

    useEffect(() => {
        props.open && setFilteredPackages(mpOptionsList);
    }, [mpOptionsList, props.open]);

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
                <Button onClick={handleClose}>
                    Close
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default AddPackageToPricingSettings;
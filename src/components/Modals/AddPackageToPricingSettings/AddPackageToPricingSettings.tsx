import React, {useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Table} from "../../UI/Table";
import {Button} from "@material-ui/core";
import {TNewPackagesToPricing} from "../../../store/reducers/pricingSettings/types";
import {addPackageToPricing} from "../../../store/reducers/pricingSettings/actions";
import {IPackageShort} from "../../../store/reducers/packages/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useSCs} from "../../../utils/hooks";
import {DialogProps} from "../types";
import {TableRowDataType} from "../../UI/types";
import Checkbox from "../../UI/Checkbox";

const tableData: TableRowDataType<IPackageShort>[] = [
    {header: "NAME", val: el => el.name, align: "left"},
    {header: "ID", val: el => el.id.toString(), align: "left"},
]

const AddPackageToPricingSettings: React.FC<DialogProps> = (props) => {
    const {mpList, mpPricingSettings} = useSelector((state: RootState) => state.pricingSettings);
    const [selectedPackages, setSelectedPackages] = useState<IPackageShort[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<IPackageShort[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        props.open && setFilteredPackages(mpList.filter(item => item.isApplyPricingOptimization));
    }, [mpList, props.open]);

    const handleAddPackage = () => {
        if (selectedSC && selectedPackages.length) {
            try {
                setIsSaving(true)
                const data: TNewPackagesToPricing = {
                    serviceCenterId: selectedSC.id,
                    maintenancePackageIds: selectedPackages
                        .map(item => item.id)
                        .filter(item => !mpPricingSettings.find(el => el.maintenancePackageId === item)),
                }
                dispatch(addPackageToPricing(data))
            } catch (e) {
                // todo show error
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

    const handleSelect = (el: IPackageShort) => {
        setSelectedPackages(prev => {
            return prev.find(item => item.id === el.id) ? prev.filter(item => item.id !== el.id) : [...prev, el]
        })
    }

    const preActions = useCallback((el: IPackageShort) => {
        return <Checkbox
            color="primary"
            disabled={!el.isApplyPricingOptimization || Boolean(mpPricingSettings.find(item => item.maintenancePackageId === el.id))}
            checked={Boolean(selectedPackages.find(item => item.id === el.id))}
            onChange={() => handleSelect(el)} />
    }, [handleSelect, selectedPackages])

    return (
        <BaseModal {...props} width={650} onClose={handleClose}>
            <DialogTitle onClose={handleClose}>Add Maintenance Package</DialogTitle>
            <DialogContent>
                <Table<IPackageShort>
                    data={filteredPackages}
                    index="id"
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
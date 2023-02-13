import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, makeStyles, Switch} from "@material-ui/core";
import {ContentTitle} from "../../Content/ContentTitle/ContentTitle";
import {RootState} from "../../../store/rootReducer";
import {PackageAccordion} from "./PackageAccordion/PackageAccordion";
import {EMaintenanceOptionType, IPackageByQuery} from "../../../api/types";
import {loadPackages} from "../../../store/reducers/packages/actions";
import {updateAvailablePackageOptions, updatePackagePriceDetails} from "../../../store/reducers/serviceCenters/actions";
import AddPackage from "../../Modals/AddPackage/AddPackage";
import {useConfirm, useException, useModal, useSCs} from "../../../utils/hooks";
import LaborRate from "./LaborRate/LaborRate";
import Disclaimer from "./Disclaimer/Disclaimer";
import {Loading} from "../../UI/Loading";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {useMakeAndModelStyles} from "../../Modals/AddPackage/parts/MakeAndModel/MakeAndModel";

type TExpandedState = {
    id?: number;
    isOpen?: boolean;
}

const useStyles = makeStyles(() => ({
    titleWrapper: {
        marginBottom: 16,
    },
    nonExpanded: {
        backgroundColor: '#E5E5E5',
    },
    topLineWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    toggleWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: 'space-between',
    },
    showPriceLabel: {
        fontSize: 16,
    },
    optionsLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        marginRight: 10
    }
}));

type TOption = {
    value: EMaintenanceOptionType;
    name: string;
}

export const MaintenanceOptionTypes = [
    {
        name: 'Base',
        value: EMaintenanceOptionType.Base
    },
    {
        name: 'Value',
        value: EMaintenanceOptionType.Value
    },
    {
        name: 'Preffered',
        value: EMaintenanceOptionType.Preferred
    }
]

export const MaintenancePackages = () => {
    const {packages: allPackages} = useSelector((state: RootState) => state.packages);
    const {loading, packagesOptionsLoading} = useSelector((state: RootState) => state.serviceCenters);
    const [packages, setPackages] = useState<IPackageByQuery[]>([]);
    const [expanded, setExpanded] = useState<TExpandedState>({});
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDisclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
    const [presentedOptions, setPresentedOptions] = useState<TOption[]>([]);
    const classes = useStyles();
    const autocompleteClasses = useMakeAndModelStyles();
    const dispatch = useDispatch();
    const showError = useException();
    const {onOpen, onClose, isOpen} = useModal();
    const {onOpen: onOpenEdit, onClose: onCloseEdit, isOpen: isOpenEdit} = useModal();
    const {askConfirm} = useConfirm();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPackages(selectedSC.id))
            const options = MaintenanceOptionTypes.filter(item => selectedSC.maintenancePackageOptionTypes?.includes(item.value))
            setPresentedOptions(options);
        }
    }, [selectedSC])

    useEffect(() => {
        if (allPackages) setPackages(allPackages);
        if (allPackages.length) setExpanded({ id: allPackages[0].id, isOpen: true})
    }, [allPackages])

    const handleAddPackage = () => {
        onOpen();
    };

    const onAccordionChange = (id: number) => {
        if (id === expanded.id) {
            setExpanded(expanded => ({id, isOpen: !expanded.isOpen}))
        } else {
            setExpanded(() => ({id, isOpen: true}))
        }
    };

    const onEditModalClose = () => {
        setIsEditing(false);
        onCloseEdit();
    }

    const handleAddDisclaimer = () => setDisclaimerOpen(!isDisclaimerOpen);

    const handleSwitch = (e: any, value: boolean) => {
        if (selectedSC) {
            dispatch(updatePackagePriceDetails(selectedSC.id, value, showError))
        }
    }

    const askRemove = useCallback((value: TOption[], packagesNeededConfig: IPackageByQuery[]) => {
        if (selectedSC) {
            const newOption = value.find(item => !presentedOptions.find(el => +el.value === +item.value))
            const packagesString = packagesNeededConfig
                .map((pack, index) => index === packagesNeededConfig.length - 1
                    ? `"${pack.name}"` :
                    `"${pack.name}", `)
            askConfirm({
                isRemove: false,
                title: `Please remember that you need to configure "${newOption?.name ?? "this"}" option for next Maintenance Packages:\n  ${packagesString}`,
                onConfirm: () => dispatch(updateAvailablePackageOptions(selectedSC.id, value.map(item => item.value), showError))
            });
        }
    }, [selectedSC, askConfirm, showError, presentedOptions])

    const onPresentedOptionsChange = useCallback((e: ChangeEvent<{}>, value: TOption[]) => {
        if (selectedSC) {
            if (value.length > presentedOptions.length) {
                const newOption = value.find(item => !presentedOptions.find(el => +el.value === +item.value))
                let packagesNeededConfig: IPackageByQuery[] = [];
                if (newOption) {
                    packagesNeededConfig = allPackages
                        .filter(pack => pack.serviceRequestsAssigned
                            .find(item => +item.type === +newOption.value && item.serviceRequestId === 0));
                }
                if (packagesNeededConfig.length) {
                    askRemove(value, packagesNeededConfig)
                } else {
                    dispatch(updateAvailablePackageOptions(selectedSC.id, value.map(item => item.value), showError))
                }
            } else {
                dispatch(updateAvailablePackageOptions(selectedSC.id, value.map(item => item.value), showError))
            }
        }
    }, [selectedSC, presentedOptions, askRemove, showError, allPackages])

    return <>
        <AddPackage onClose={isEditing ? onEditModalClose : onClose} open={isOpen || isOpenEdit} isEditing={isEditing}/>
        <div className={classes.topLineWrapper}>
            <div className={classes.toggleWrapper}>
                {loading
                    ? <Loading/>
                    : <React.Fragment>
                        <p className={classes.showPriceLabel}>Show Price Details</p>
                        <Switch
                            onChange={handleSwitch}
                            checked={selectedSC?.isShowPriceDetails}
                            color="primary"
                        />
                    </React.Fragment>}
            </div>
            <div style={{display: "flex", alignItems: "center"}}>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    variant="contained"
                    onClick={handleAddDisclaimer}
                >
                    {isDisclaimerOpen ? 'Close' : 'Open'} Disclaimer
                </Button>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    variant="contained"
                    onClick={handleAddPackage}
                >
                    Add Package
                </Button>
            </div>
        </div>
        <div className={classes.topLineWrapper}>
            <LaborRate/>
            <div style={{display: "flex", alignItems: "center", width: '50%'}}>
                {packagesOptionsLoading
                    ? <Loading/>
                    : <React.Fragment>
                        <p className={classes.optionsLabel}>Available Package Options</p>
                        <Autocomplete
                            fullWidth
                            multiple
                            classes={autocompleteClasses}
                            options={MaintenanceOptionTypes}
                            disableCloseOnSelect
                            getOptionLabel={o => o.name}
                            value={presentedOptions}
                            onChange={onPresentedOptionsChange}
                            renderInput={autocompleteRender({
                                label: "",
                                placeholder: 'Select Available Package Options'
                            })}
                        />
                    </React.Fragment>
                }
            </div>
        </div>
        {isDisclaimerOpen
            ? <Disclaimer setDisclaimerOpen={setDisclaimerOpen}/>
            : null}
        <div className={classes.titleWrapper}>
            <ContentTitle title="Maintenance Package Pricing"/>
        </div>
        {packages.map((item: IPackageByQuery, index) => {
            return <PackageAccordion
                setIsEditing={setIsEditing}
                onOpenEdit={onOpenEdit}
                key={item.id}
                title={item.name}
                defaultExpanded={index === 0}
                id={item.id}
                expanded={expanded.id === item.id && expanded.isOpen}
                onExpandIconClick={() => onAccordionChange(item.id)}
            />
        })}
    </>
}
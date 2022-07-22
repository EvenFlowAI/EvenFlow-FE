import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, makeStyles} from "@material-ui/core";
import {ContentTitle} from "../../Content/ContentTitle/ContentTitle";
import {RootState} from "../../../store/rootReducer";
import {PackageAccordion} from "./PackageAccordion/PackageAccordion";
import {IPackageByQuery} from "../../../api/types";
import {getPackageById, loadPackages} from "../../../store/reducers/packages/actions";
import AddPackage from "../../Modals/AddPackage/AddPackage";
import {useModal} from "../../../utils/hooks";
import LaborRate from "./LaborRate/LaborRate";
import {TextField} from "../../UI/TextField";

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
        marginBottom: 20,
    }
}));

export const MaintenancePackages = () => {
    const selectedSc = useSelector((state: RootState) => state.serviceCenters.selectedSC);
    const {packages: allPackages} = useSelector((state: RootState) => state.packages);
    const [packages, setPackages] = useState<IPackageByQuery[]>([]);
    const [expanded, setExpanded] = useState<TExpandedState>({});
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [disclaimer, setDisclaimer] = useState<string>('');
    const [isDisclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const {onOpen, onClose, isOpen} = useModal();
    const {onOpen: onOpenEdit, onClose: onCloseEdit, isOpen: isOpenEdit} = useModal();

    useEffect(() => {
        if (selectedSc) {
            dispatch(loadPackages(selectedSc.id))
            if (selectedSc.disclaimer) setDisclaimer(selectedSc.disclaimer);
        }
        return () => {
            dispatch(getPackageById(null));
        }
    }, [selectedSc])

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

    const onDisclaimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisclaimer(e.target.value)
    }

    const handleCancel = () => {
        setDisclaimer(selectedSc?.disclaimer ?? '');
        setDisclaimerOpen(false);
    }

    const handleSave = () => {
        // todo request
    }

    return <>
        <AddPackage onClose={isEditing ? onEditModalClose : onClose} open={isOpen || isOpenEdit} isEditing={isEditing}/>
        <div className={classes.topLineWrapper}>
            <LaborRate/>
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
        {isDisclaimerOpen
            ? <div>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={disclaimer}
                    style={{marginBottom: 20}}
                    label="Maintenance Package Page Disclaimer (for Booking Flow)"
                    placeholder="Enter Disclaimer Text"
                    onChange={onDisclaimerChange}
                />
                <div style={{display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
                    <Button
                        style={{marginLeft: 16}}
                        color="primary"
                        variant="outlined"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        style={{marginLeft: 16}}
                        color="primary"
                        variant="contained"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            </div>
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
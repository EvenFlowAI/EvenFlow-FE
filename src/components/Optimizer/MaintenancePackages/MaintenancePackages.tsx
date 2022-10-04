import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, makeStyles, Switch} from "@material-ui/core";
import {ContentTitle} from "../../Content/ContentTitle/ContentTitle";
import {RootState} from "../../../store/rootReducer";
import {PackageAccordion} from "./PackageAccordion/PackageAccordion";
import {IPackageByQuery} from "../../../api/types";
import {getPackageById, loadPackages} from "../../../store/reducers/packages/actions";
import {updatePackagePriceDetails} from "../../../store/reducers/serviceCenters/actions";
import AddPackage from "../../Modals/AddPackage/AddPackage";
import {useException, useModal, useSCs} from "../../../utils/hooks";
import LaborRate from "./LaborRate/LaborRate";
import Disclaimer from "./Disclaimer/Disclaimer";
import {Loading} from "../../UI/Loading";

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
    },
    toggleWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: 'space-between',
    }
}));

export const MaintenancePackages = () => {
    const {packages: allPackages} = useSelector((state: RootState) => state.packages);
    const {loading} = useSelector((state: RootState) => state.serviceCenters);
    const [packages, setPackages] = useState<IPackageByQuery[]>([]);
    const [expanded, setExpanded] = useState<TExpandedState>({});
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDisclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const showError = useException();
    const {onOpen, onClose, isOpen} = useModal();
    const {onOpen: onOpenEdit, onClose: onCloseEdit, isOpen: isOpenEdit} = useModal();
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadPackages(selectedSC.id))
        }
        return () => {
            dispatch(getPackageById(null));
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


    return <>
        <AddPackage onClose={isEditing ? onEditModalClose : onClose} open={isOpen || isOpenEdit} isEditing={isEditing}/>
        <div className={classes.topLineWrapper}>
            <LaborRate/>
            <div className={classes.toggleWrapper}>
                {loading
                    ? <Loading/>
                    : <React.Fragment>
                        <h4>Show Price Details</h4>
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
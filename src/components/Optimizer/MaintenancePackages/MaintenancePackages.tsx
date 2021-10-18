import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, makeStyles} from "@material-ui/core";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../../Optimizer/utils";
import {SearchInput} from "../../UI/SearchInput";
import {ContentTitle} from "../../Content/ContentTitle/ContentTitle";
import {RootState} from "../../../store/rootReducer";
import {PackageAccordion} from "./PackageAccordion/PackageAccordion";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {IBusinessRule, IComplimentaryService, IPackageByQuery} from "../../../api/types";
import {loadPackages} from "../../../store/reducers/packages/actions";
import AddPackage from "../../Modals/AddPackage/AddPackage";
import {useModal} from "../../../utils/hooks";

export type TPackage = {
  name: string;
  id: number;
  serviceRequests: IServiceRequest[];
  complimentaryServices: IComplimentaryService[];
  businessRules: IBusinessRule;
};

type TExpandedState = {
    id?: number;
    isOpen?: boolean;
}

const useStyles = makeStyles(theme => ({
    titleWrapper: {
        marginBottom: 16,
    },
    nonExpanded: {
        backgroundColor: '#E5E5E5',
    }
}));

export const MaintenancePackages = () => {
    const selectedSc = useSelector((state: RootState) => state.serviceCenters.selectedSC);
    const {packages: allPackages} = useSelector((state: RootState) => state.packages);
    const [packages, setPackages] = useState<IPackageByQuery[]>([]);
    const [expanded, setExpanded] = useState<TExpandedState>({});
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const {onOpen, onClose, isOpen} = useModal();
    
    useEffect(() => {
        if (selectedSc) {
            dispatch(loadPackages(selectedSc.id))
        }
    }, [selectedSc])

    useEffect(() => {
        if (allPackages) setPackages(allPackages);
        if (allPackages.length) setExpanded({ id: allPackages[0].id, isOpen: true})
    }, [allPackages])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    }

    let search = '';

    const handleSearch = () => {

    };

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

    const onAddModalClose = () => {
        setIsEditing(false);
        onClose();
    }

    return <>
        <AddPackage onClose={onAddModalClose} open={isOpen || isEditing} isEditing={isEditing}/>
    <TitleContainer
        pad
        parent={optimizerRoot}
        actions={<div style={{display: "flex", alignItems: "center"}}>
            <SearchInput
                onChange={handleSearchChange}
                value={search}
                onSearch={handleSearch}
            />
            <Button
                style={{marginLeft: 16}}
                color="primary"
                variant="contained"
                onClick={handleAddPackage}
            >
                Add Package
            </Button>
        </div>}
    />
    <div className={classes.titleWrapper}>
    <ContentTitle title="Maintenance Package Pricing"/>
    </div>
        {packages.map((item: IPackageByQuery, index) => {
            return <PackageAccordion
                setIsEditing={setIsEditing}
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
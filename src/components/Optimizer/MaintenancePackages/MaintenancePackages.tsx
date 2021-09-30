import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Button, makeStyles} from "@material-ui/core";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../../Optimizer/utils";
import {SearchInput} from "../../UI/SearchInput";
import {ContentTitle} from "../../Content/ContentTitle/ContentTitle";
import {Api} from "../../../config/requests";
import {RootState} from "../../../store/rootReducer";
import {PackageAccordion} from "./PackageAccordion/PackageAccordion";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {IBusinessRule, IComplimentaryService} from "../../../api/types";

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
    const selectedPod = useSelector((state: RootState) => state.pods.selectedPod);
    const [packages, setPackages] = useState<[]>([]);
    const [expanded, setExpanded] = useState<TExpandedState>({});
    const classes = useStyles();
    
    useEffect(() => {
        if (selectedSc) {
            const data = {
                podId: null,
                serviceCenterId: selectedSc.id,
                pageIndex: 0,
                pageSize: 0,
            }
            Api.call(Api.endpoints.MaintenancePackages.GetByQuery, {data})
                .then(result => {
                    if (result?.data?.result) {
                        setPackages(result.data.result)
                        if (result.data.result.length) {
                            setExpanded({id: result.data.result[0].id, isOpen: true});
                        }
                    }
                }).catch(err => {
                console.log(err);
            })   
        }
        
    }, [selectedSc, selectedPod])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    }

    let search = '';

    const handleSearch = () => {

    };

    const handleAddPackage = () => {

    };

    const onAccordionChange = (id: number) => {
        setExpanded(() => ({id, isOpen: !expanded.isOpen}))
    };

    return <>
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
        {packages.map((item: TPackage, index) => {
            return <PackageAccordion
                title={item.name}
                defaultExpanded={index === 0}
                id={item.id}
                expanded={expanded.id === item.id && expanded.isOpen}
                onExpandIconClick={() => onAccordionChange(item.id)}
            />
        })}
    </>
}
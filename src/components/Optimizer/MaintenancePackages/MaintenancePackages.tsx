import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {Button} from "@material-ui/core";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../../Optimizer/utils";
import {SearchInput} from "../../UI/SearchInput";
import {ContentTitle} from "../../Content/ContentTitle/ContentTitle";
import {Api} from "../../../config/requests";
import {RootState} from "../../../store/rootReducer";

export const MaintenancePackages = () => {
    const selectedSc = useSelector((state: RootState) => state.serviceCenters.selectedSC);
    const selectedPod = useSelector((state: RootState) => state.pods.selectedPod);
    
    useEffect(() => {
        if (selectedSc) {
            const data = {
                podId: selectedPod?.id || 0,
                serviceCenterId: selectedSc.id,
                pageIndex: 0,
                pageSize: 0,
            }
            Api.call(Api.endpoints.MaintenancePackages.GetByQuery, {data})
                .then(result => {
                    console.log(result);
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
    <ContentTitle title="Maintenance Package Pricing"/>

    </>
}
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {Api} from "../../../config/requests";
import {IDealershipGroupExtended} from "../../../store/reducers/dealershipGroups/types";
import {concatAddress} from "../../../utils/utils";

export const DealershipGroupDetail = () => {
    const {id} = useParams();
    const [dealership, setDS] = useState<IDealershipGroupExtended | undefined>();
    useEffect(() => {
        Api.call<IDealershipGroupExtended>(Api.endpoints.Dealerships.Retrieve, {urlParams: {id}})
            .then(r => {
                setDS(r.data);
            });
    }, [setDS, id])
    return <>
        <TitleContainer
            title={dealership?.name || ""}
            subtitle={dealership?.address ? concatAddress(dealership.address) : dealership?.mainAddress}
            pad />
    </>;
}
import React from 'react';
import {TitleContainer} from "../../../components/Content/TitleContainer/TitleContainer";
import {Titles} from "../../../config/constants";
import {DealershipGroupsTable} from "../../../features/DealershipGroups/DealershipGroupsTable/DealershipGroupsTable";

const DealershipGroups = () => {
    return (
        <>
            <TitleContainer title={Titles.DealershipGroups} actions pad />
            <DealershipGroupsTable/>
        </>
    );
};

export default DealershipGroups;
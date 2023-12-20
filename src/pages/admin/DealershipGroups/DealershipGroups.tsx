import React from 'react';
import {TitleContainer} from "../../../components/UI/TitleContainer";
import {Titles} from "../../../config/constants";
import {DealershipGroupsTable} from "../../../features/DealershipGroups/DealershipGroupsTable/DealershipGroupsTable";
import {DealershipActions} from "../../../features/DealershipGroups/DealershipActions/DealershipActions";

const DealershipGroups = () => {
    return (
        <>
            <TitleContainer title={Titles.DealershipGroups} actions={<DealershipActions/>} pad />
            <DealershipGroupsTable/>
        </>
    );
};

export default DealershipGroups;
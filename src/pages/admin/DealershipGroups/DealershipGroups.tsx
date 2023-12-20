import React from 'react';
import {TitleContainer} from "../../../components/TitleContainer/TitleContainer";
import {Titles} from "../../../config/constants";
import {DealershipGroupsTable} from "../../../features/admin/DealershipGroups/DealershipGroupsTable/DealershipGroupsTable";
import {DealershipActions} from "../../../features/admin/DealershipGroups/DealershipActions/DealershipActions";

const DealershipGroups = () => {
    return (
        <>
            <TitleContainer title={Titles.DealershipGroups} actions={<DealershipActions/>} pad />
            <DealershipGroupsTable/>
        </>
    );
};

export default DealershipGroups;
import React from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {DealershipGroupsTable} from "../../../features/admin/DealershipGroups/DealershipGroupsTable/DealershipGroupsTable";
import {DealershipActions} from "../../../features/admin/DealershipGroups/DealershipActions/DealershipActions";
import {Titles} from "../../../types/types";

const DealershipGroups = () => {
    return (
        <>
            <TitleContainer title={Titles.DealershipGroups} actions={<DealershipActions/>} pad />
            <DealershipGroupsTable/>
        </>
    );
};

export default DealershipGroups;
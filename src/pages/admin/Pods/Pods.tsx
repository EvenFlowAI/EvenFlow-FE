import React from 'react';
import {TitleContainer} from "../../../components/wrappers/TitleContainer/TitleContainer";
import {SquarePaper} from "../../../components/styled/Paper";
import {PodsTable} from "../../../features/admin/PodsTable/PodsTable";
import {capacityManagementRoot} from "../../../utils/constants";

const Pods = () => {
    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Pods" pad parent={capacityManagementRoot}/>
            <SquarePaper variant="outlined" style={{padding: 20}}>
                <PodsTable />
            </SquarePaper>
        </div>
    );
};

export default Pods;
import React from 'react';
import {TitleContainer} from "../../../components/UI/TitleContainer";
import {SquarePaper} from "../../../components/styled/Paper";
import {PodsTable} from "../../../features/PodsTable/PodsTable";
import {optimizerRoot} from "../../../config/constants";

const Pods = () => {
    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Pods" pad parent={optimizerRoot}/>
            <SquarePaper variant="outlined" style={{padding: 20}}>
                <PodsTable />
            </SquarePaper>
        </div>
    );
};

export default Pods;
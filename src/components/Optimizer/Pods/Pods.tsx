import React from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {SquarePaper} from "../../styled/Paper";
import {PodsTable} from "../../PodsTable/PodsTable";

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
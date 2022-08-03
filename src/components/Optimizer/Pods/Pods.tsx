import React from 'react';
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {SquarePaper} from "../../UI/Paper";
import {ProfilePODs} from "../../Admin/Profile/ProfilePODs";

const Pods = () => {
    return (
        <div style={{width: '100%'}}>
            <TitleContainer title="Pods" pad parent={optimizerRoot}/>
            <SquarePaper variant="outlined" style={{padding: 20}}>
                <ProfilePODs />
            </SquarePaper>
        </div>
    );
};

export default Pods;
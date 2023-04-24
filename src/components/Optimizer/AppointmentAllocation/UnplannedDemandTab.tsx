import React, {useState} from 'react';
import UnplannedDemandEditing from "./UnplannedDemandEditing";
import {UnplannedDemand} from "./UnplannedDemand";

const UnplannedDemandTab = () => {
    const [isEdit, setEdit] = useState<boolean>(false);

    return (
        <div style={{overflowX: "auto"}}>
            {isEdit
                ? <UnplannedDemandEditing setEdit={setEdit} isEdit={isEdit}/>
                : <UnplannedDemand setEdit={setEdit} isEdit={isEdit}/>}
        </div>
    );
};

export default UnplannedDemandTab;
import React from "react";
import {Button} from "@material-ui/core";
import {useModal, useSCs} from "../../../../utils/hooks";

export const UrgentRequests = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const {selectedSC} = useSCs();


    return <div>
        <div style={{textAlign: "right"}}>
            <Button
                onClick={onOpen}
                color="primary"
                variant="contained"
            >
                Add Urgent request
            </Button>
        </div>
    </div>
}
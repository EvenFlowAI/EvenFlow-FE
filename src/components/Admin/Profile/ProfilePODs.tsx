import React, {useState} from "react";
import {useModal, useSCs} from "../../../utils/hooks";
import {PODModal} from "../../Modals/PODModal/PODModal";
import {Button} from "@material-ui/core";
import {IPod} from "../../../store/reducers/pods/types";

export const ProfilePODs = () => {
    const {selectedSC} = useSCs();
    const [editedItem, setEditedItem] = useState<IPod|undefined>(undefined);
    const {isOpen, onClose, onOpen} = useModal();

    const handleAdd = () => {
        setEditedItem(undefined);
        onOpen();
    }

    return <div>
        <div style={{textAlign: "right"}}>
            <Button
                onClick={handleAdd}
                variant="contained"
                color="primary"
            >
                Create New POD
            </Button>
        </div>
        <p>PODs</p>
        <PODModal open={isOpen} onClose={onClose} payload={editedItem} />
    </div>
}
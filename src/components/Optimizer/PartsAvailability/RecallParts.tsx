import React from 'react';
import {useModal} from "../../../utils/hooks";
import RecallTable from "./RecallTable";
import {optimizerRoot} from "../utils";
import {Button} from "@material-ui/core";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import AddRecall from "../../Modals/AddRecall/AddRecall";

const RecallParts = () => {
    const {isOpen, onOpen, onClose} = useModal();

    const handleAddRecall = () => {
        onOpen();
    }

    return (
        <>
            <TitleContainer
                pad
                parent={optimizerRoot}
                actions={<div style={{display: "flex", alignItems: "center"}}>
                    <Button
                        style={{marginLeft: 16}}
                        color="primary"
                        variant="contained"
                        onClick={handleAddRecall}
                    >
                        Add Recall
                    </Button>
                </div>}
            />
        <RecallTable/>
            <AddRecall open={isOpen} editingItem={null} onClose={onClose}/>
        </>
    );
};

export default RecallParts;
import React, {useState} from 'react';
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {useModal} from "../../../utils/hooks";
import {Button} from "@material-ui/core";
import {bookingFlowRoot} from "../../../config/constants";
import {TitleContainer} from "../../../components/Content/TitleContainer/TitleContainer";
import {AddFirstScreenOptionModal} from "../../../features/FirstScreenOptions/AddFirstScreenOptionModal/AddFirstScreenOptionModal";
import {FirstScreenOptionsTable} from "../../../features/FirstScreenOptions/FirstScreenOptionsTable/FirstScreenOptionsTable";

export const FirstScreenOptionsPage = () => {
    const [currentItem, setCurrentItem] = useState<IFirstScreenOption | null>(null);
    const {isOpen, onOpen, onClose} = useModal();

    const onOpenAdd = async () => {
        await setCurrentItem(null);
        await onOpen();
    }

    return (
        <React.Fragment>
            <TitleContainer
                title="First Screen"
                pad
                parent={bookingFlowRoot}
                actions={
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpenAdd}
                    variant="contained">
                    Add Service Option
                </Button>
            }/>
            <FirstScreenOptionsTable
                setCurrentItem={setCurrentItem}
                currentItem={currentItem}
                onOpen={onOpen}/>
            <AddFirstScreenOptionModal
                open={isOpen}
                editingItem={currentItem}
                onClose={onClose}/>
        </React.Fragment>
    );
};
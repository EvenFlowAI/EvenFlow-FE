import React, {useState} from 'react';
import {BaseModal, DialogTitle, DialogContent} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {Button, styled} from "@material-ui/core";

const TopWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase'
})

const ButtonsWrapper = styled('div')({
    width: "40%",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
})

const ShowDropOffTimeDialog: React.FC<DialogProps> = ({onClose, open}) => {
    const [isShowTime, setIsShowTime] = useState<boolean>(false);
    const [text, setText] = useState<string>('');

    const onCancel = () => {
        onClose()
    }

    const onSave = () => {

    }

    return (
        <BaseModal onClose={onCancel} open={open}>
            <DialogTitle onClose={onCancel}>
                <TopWrapper>
                    Show Drop Off Time
                    <ButtonsWrapper>
                        <Button variant="text" onClick={onCancel} color="secondary">Cancel</Button>
                        <Button variant="text" onClick={onSave} color="primary">Save</Button>
                    </ButtonsWrapper>
                </TopWrapper>
            </DialogTitle>
            <DialogContent>

            </DialogContent>
        </BaseModal>
    );
};

export default ShowDropOffTimeDialog;
import React, {useEffect, useState} from 'react';
import {BaseModal, DialogTitle, DialogContent} from "../../Modals/BaseModal";
import {DialogProps} from "../../Modals/types";
import {Button, FormControlLabel, Radio, RadioGroup, styled} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";

export const TopWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase'
})

export const ButtonsWrapper = styled('div')({
    width: "40%",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
})

const Textarea = styled(TextField)({
    "& textarea": {
        padding: "8px 11px"
    },
});

const Warning = styled('p')({
    height: 20,
    color: '#FF0000',
    fontSize: 12,
    marginBottom: 20
})

const ShowDropOffTimeDialog: React.FC<DialogProps> = ({onClose, open}) => {
    const {centerSettings} = useSelector((state: RootState) => state.capacityServiceValet);
    const [isShowTime, setIsShowTime] = useState<boolean>(false);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        if (centerSettings) {
            setIsShowTime(centerSettings.isShowDropOffTime)
            setText(centerSettings?.isShowDropOffDescription ?? '');
        }
    }, [centerSettings])

    const onCancel = () => {
        onClose()
    }

    const onSave = () => {
        if (!isShowTime) {
            if (text.length) {
                // todo request
            }
        } else {
            // todo request
        }
    }

    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsShowTime(e.target.value === 'Yes')
    }

    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }

    return (
        <BaseModal onClose={onCancel} open={open} width={375}>
            <DialogTitle>
                <TopWrapper>
                    Show Drop Off Time
                    <ButtonsWrapper>
                        <Button variant="text" onClick={onCancel} color="secondary" style={{textTransform: 'none'}}>Cancel</Button>
                        <Button variant="text" onClick={onSave} color="primary" style={{textTransform: 'none'}}>Save</Button>
                    </ButtonsWrapper>
                </TopWrapper>
            </DialogTitle>
            <DialogContent>
                <RadioGroup
                    row
                    aria-label="countType"
                    name="countType"
                    value={isShowTime ? 'Yes' : 'No'}
                    onChange={handleRadio}
                >
                    <FormControlLabel
                        value={"Yes"}
                        control={<Radio color="primary"/>}
                        label="Yes"
                    />
                    <FormControlLabel
                        value={"No"}
                        control={<Radio color="primary"/>}
                        label="No"
                    />
                </RadioGroup>
                <p>Enter the text to display in the booking flow about communicating drop off expectations</p>
                <Textarea
                    disabled={isShowTime}
                    multiline
                    fullWidth
                    placeholder="Your text"
                    onChange={onTextChange}
                    value={text}
                    rows={3}
                />
                <Warning>{!isShowTime ? 'Please enter a text' : ''}</Warning>
            </DialogContent>
        </BaseModal>
    );
};

export default ShowDropOffTimeDialog;
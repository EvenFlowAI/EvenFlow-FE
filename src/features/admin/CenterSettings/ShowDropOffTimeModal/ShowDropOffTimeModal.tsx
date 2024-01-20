import React, {useEffect, useState} from 'react';
import {BaseModal, DialogTitle, DialogContent} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {Button, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {updateShowDropOffTime} from "../../../../store/reducers/capacityServiceValet/actions";
import {IShowDropOffTime} from "../../../../store/reducers/capacityServiceValet/types";
import {ButtonsWrapper, TopWrapper} from "../styles";
import {Textarea, Warning} from "./styles";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const ShowDropOffTimeModal: React.FC<React.PropsWithChildren<DialogProps>> = ({onClose, open}) => {
    const {centerSettings} = useSelector((state: RootState) => state.capacityServiceValet);
    const [isShowTime, setIsShowTime] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showError = useException();

    useEffect(() => {
        if (centerSettings && open) {
            setIsShowTime(centerSettings.showDropOffTime)
            setText(centerSettings?.dropOffTimeDescription ?? '');
        }
    }, [centerSettings, open])

    const onCancel = () => {
        setIsShowTime(false)
        setText('')
        onClose()
    }

    const onSave = () => {
        if (selectedSC) {
            const data: IShowDropOffTime = {
                showDropOffTime: isShowTime,
                description: text,
            }
            if (!isShowTime) {
                if (text.trim().length) {
                    dispatch(updateShowDropOffTime(selectedSC.id, data, onCancel, showError))
                } else {
                    showError('"Text" must not be empty')
                }
            } else {
                dispatch(updateShowDropOffTime(selectedSC.id, data, onCancel, showError))
            }
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
                <Warning>{!isShowTime && !text.trim().length ? 'Please enter a text' : ''}</Warning>
            </DialogContent>
        </BaseModal>
    );
};

export default ShowDropOffTimeModal;
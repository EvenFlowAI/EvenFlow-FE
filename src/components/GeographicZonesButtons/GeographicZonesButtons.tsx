import React from 'react';
import {ButtonsWrapper, TextButton} from "./styles";
import {Button} from "@material-ui/core";
import {TCallback} from "../../types/types";
import {TZone} from "../../store/reducers/mobileService/types";

type TProps = {
    onEditZoneOpen: TCallback;
    onAddZoneOpen: TCallback;
    selectedZone: TZone|null;
    askRemove: TCallback;
}

const GeographicZonesButtons: React.FC<TProps> = ({onEditZoneOpen, selectedZone, askRemove, onAddZoneOpen}) => {
    return (
        <ButtonsWrapper>
            <TextButton variant="text" onClick={onEditZoneOpen} disabled={!selectedZone}>Edit</TextButton>
            <TextButton variant="text" onClick={askRemove} disabled={!selectedZone}>Remove</TextButton>
            <Button onClick={onAddZoneOpen} variant="contained" color="primary" style={{width: 160}}>Add Zone</Button>
        </ButtonsWrapper>
    );
};

export default GeographicZonesButtons;
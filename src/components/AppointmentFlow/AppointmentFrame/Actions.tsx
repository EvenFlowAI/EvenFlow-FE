import React from 'react';
import {Button, styled} from "@material-ui/core";

type TProps = {
    onBack: () => void;
    onNext: () => void;
};
const ButtonsRow = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: '22px',
    marginTop: 20,
    "& button": {
        minWidth: 144
    }
});
export const Actions: React.FC<TProps> = ({onBack, onNext}) => {
    return (
        <ButtonsRow>
            <Button onClick={onBack} color={'primary'} variant='outlined'>Back</Button>
            <Button onClick={onNext} color={'primary'} variant='contained'>Submit</Button>
        </ButtonsRow>
    );
};
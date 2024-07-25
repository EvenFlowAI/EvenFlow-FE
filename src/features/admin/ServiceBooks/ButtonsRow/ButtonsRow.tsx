import React from 'react';
import {ButtonsWrapper, Definition, Wrapper} from "./styles";
import {ReactComponent as Checked} from '../../../../assets/img/checkmark.svg'
import {ReactComponent as Unchecked} from '../../../../assets/img/radiobutton_unchecked.svg'
import {Button} from "@mui/material";
import {useModal} from "../../../../hooks/useModal/useModal";
import {ServiceBookModal} from "../../ServiceBookModal/ServiceBookModal";

const ButtonsRow = () => {
    const {isOpen, onClose, onOpen} = useModal();
    return (
        <Wrapper>
            <Definition>
                <div className="title">Service Book Definition:</div>
               <Checked className="checkmark"/>
                <div className="checkmarkLabel">Included</div>
                <Unchecked className="checkmark"/>
                <div className="checkmarkLabel">Not Included</div>
            </Definition>
            <ButtonsWrapper>
                <Button variant="contained" onClick={onOpen}>Create Service Book</Button>
            </ButtonsWrapper>
            <ServiceBookModal open={isOpen} onClose={onClose} editingItemId={undefined} />
        </Wrapper>
    );
};

export default ButtonsRow;
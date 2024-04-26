import React from 'react';
import {ButtonsWrapper, Definition, Wrapper} from "./styles";
import {ReactComponent as Checked} from '../../../../assets/img/checkmark_round_checked.svg'
import {ReactComponent as Unchecked} from '../../../../assets/img/checkmark_round_unchecked.svg'
import {Button} from "@mui/material";
import {useModal} from "../../../../hooks/useModal/useModal";
import {PODModal} from "../../PodsTable/PODModal/PODModal";
import {recalculateCapacity} from "../../../../store/reducers/demandSegments/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useException} from "../../../../hooks/useException/useException";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";

const ButtonsRow = () => {
    const {isRecalculationLoading} = useSelector((state: RootState) => state.demandSegments);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {isOpen, onClose, onOpen} = useModal();
    const showError = useException();
    const showMessage = useMessage();

    const onSuccess = () => {
        showMessage('Capacity recalculated')
    }

    const recalculate = () => {
        if (selectedSC) dispatch(recalculateCapacity(selectedSC.id, onSuccess, showError))
    }

    return (
        <Wrapper>
            <Definition>
                <div className="title">Service Book Definition:</div>
                <div className="checkmark"><Checked/></div>
                {/*<div className="checkmarkLabel">Included</div>*/}
                <div className="checkmark"><Unchecked/></div>
                {/*<div className="checkmarkLabel">Not Included</div>*/}
            </Definition>
            <ButtonsWrapper>
                <Button variant="contained" onClick={onOpen}>Create Service Book</Button>
                <LoadingButton
                    loading={isRecalculationLoading}
                    variant="outlined"
                    onClick={recalculate}>
                    Recalculate Capacity
                </LoadingButton>
            </ButtonsWrapper>
            <PODModal open={isOpen} onClose={onClose} editingItemId={undefined} />
        </Wrapper>
    );
};

export default ButtonsRow;
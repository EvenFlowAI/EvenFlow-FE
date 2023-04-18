import React from 'react';
import {Button} from "@material-ui/core";
import {Loading} from "../../UI/Loading";
import {ButtonsRow} from "./Actions";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {setPackageEMenuType} from "../../../store/reducers/appointmentFrameReducer/actions";
import {EPackageEMenuType} from "../../../store/reducers/appointmentFrameReducer/types";

type TProps = {
    isLoading: boolean,
    onBack: () => void,
    onNext: () => void,
}

const PackageEMenuActions: React.FC<TProps> = ({isLoading, onBack, onNext}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const onSelectFactory = () => {
        dispatch(setPackageEMenuType(EPackageEMenuType.Factory));
        onNext();
    }
    const onSelectDealer = () => {
        dispatch(setPackageEMenuType(EPackageEMenuType.Dealer));
        onNext();
    }

    return (
        <ButtonsRow>
            {!isLoading ? <>
                <Button
                    onClick={onBack}
                    color={'primary'}
                    variant='outlined'
                    style={{backgroundColor: '#F7F8FB'}}>
                    {t("Back")}
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={onSelectFactory}
                    color={'primary'}
                    variant='contained'>
                    {t("Select Factory")}
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={onSelectDealer}
                    color={'primary'}
                    variant='contained'>
                    {t("Select Dealer")}
                </Button>
            </> : <Loading />}
        </ButtonsRow>
    );
};

export default PackageEMenuActions;
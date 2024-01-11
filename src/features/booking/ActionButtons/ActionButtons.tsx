import React from 'react';
import {Button} from "@mui/material";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {useTranslation} from "react-i18next";
import {ButtonsRow} from "./styles";
import {TActionProps} from "../../../types/types";

export const ActionButtons: React.FC<TActionProps> = (
    {
        onBack,
        onNext,
        nextDisabled,
        nextLabel,
        loading,
        prevDisabled,
        prevLabel,
        hideNext,
        hidePrev
    }
) => {
    const {t} = useTranslation();
    return (
        <ButtonsRow>
            {!loading ? <>
                {!hidePrev && <Button
                    onClick={onBack}
                    color={'primary'}
                    variant='outlined'
                    disabled={prevDisabled}
                    style={{backgroundColor: '#F7F8FB'}}>
                    {prevLabel ?? t("Back")}
                </Button>}
                {!hideNext && <Button
                    disabled={nextDisabled}
                    onClick={onNext}
                    color={'primary'}
                    variant='contained'>
                    {nextLabel ?? t("Submit")}
                </Button>}
            </> : <Loading />}
        </ButtonsRow>
    );
};
import React from 'react';
import {Button, styled} from "@material-ui/core";
import { TActionProps } from './types';
import {Loading} from "../../UI/Loading";
import {useTranslation} from "react-i18next";


export const ButtonsRow = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "22px",
    marginTop: 20,
    "& button": {
        minWidth: 144
    },
    [theme.breakpoints.down('xs')]: {
        flexDirection: "row",
        width: "100%",
        gap: "12px",
        "& button": {
            width: "100%"
        }
    }
}));
export const Actions: React.FC<TActionProps> = (
    {
        onBack,
        onNext,
        nextDisabled,
        nextLabel,
        loading,
        prevDisabled,
        prevLabel,
        hideNext
    }
) => {
    const {t} = useTranslation();
    return (
        <ButtonsRow>
            {!loading ? <>
                <Button
                    onClick={onBack}
                    color={'primary'}
                    variant='outlined'
                    disabled={prevDisabled}
                    style={{backgroundColor: '#F7F8FB'}}>
                    {prevLabel ?? t("Back")}
                </Button>
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
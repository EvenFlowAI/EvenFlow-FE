import React from 'react';
import {useTranslation} from "react-i18next";

export const NotFoundError = () => {
    const {t} = useTranslation();
    return <p>
        {t("Sorry, we can't find your appointment")}.
        <br/>
        {t("Please check your link or contact service center directly")}.
    </p>
};
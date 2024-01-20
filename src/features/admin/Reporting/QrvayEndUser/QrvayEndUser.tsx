import React from 'react';
import {IEndUserConfig} from "../types";

export const QrveyEndUser: React.FC<React.PropsWithChildren<{ settings: IEndUserConfig }>> = ({settings}) => {
    // @ts-ignore
    window['endUserConfig'] = settings;

    // @ts-ignore
    return <qrvey-end-user settings={'endUserConfig'}/>
};
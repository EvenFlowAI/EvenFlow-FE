import React from 'react';
import {IEndUserConfig} from "./types";

const QrveyEndUser: React.FC<{ settings: IEndUserConfig }> = ({settings}) => {

    // @ts-ignore
    window['endUserConfig'] = settings;

    // @ts-ignore
    return <qrvey-end-user settings={'endUserConfig'}/>;
};

export default QrveyEndUser;
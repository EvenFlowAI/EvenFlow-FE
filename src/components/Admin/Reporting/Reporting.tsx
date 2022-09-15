import React from 'react';
import {Titles} from "../../../config/constants";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {IEndUserConfig} from "../../../qrveyEndUser/types";
import QrveyEndUser from "../../../qrveyEndUser/QrvayEndUser";

const Reporting = () => {
    const configObject: IEndUserConfig = {
        domain: 'https://pcuxl.qrveyapp.com',
        appid: 'jjaR5hX2q',
        apikey: '0nv7hbDaQmjdTbBLWGV81ldOgX9QGLmKGYH3t6Dt',
    };
    return (
        <div style={{display: "block", width: "100%"}}>
            <TitleContainer
                title={Titles.Reporting}
                pad/>
            <QrveyEndUser settings={configObject}/>
        </div>
    );
};

export default Reporting;
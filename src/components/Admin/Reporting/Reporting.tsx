import React, {useEffect, useState} from 'react';
import {Titles} from "../../../config/constants";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {IEndUserConfig} from "../../../qrveyEndUser/types";
import QrveyEndUser from "../../../qrveyEndUser/QrvayEndUser";
import {Api} from "../../../config/requests";
import {useSCs} from "../../../utils/hooks";

const configObject = {
    appid: 'jjaR5hX2q',
    apikey: '0nv7hbDaQmjdTbBLWGV81ldOgX9QGLmKGYH3t6Dt',
};

const Reporting = () => {
    const [config, setConfig] = useState<IEndUserConfig>({
        domain: 'https://pcuxl.qrveyapp.com',
    })
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC) {
            Api.call(Api.endpoints.Qrvey.GetToken, {data: {serviceCenterId: selectedSC.id}})
                .then(result => {
                    if (result?.data?.token) setConfig(prev => ({...prev, qv_token: result.data.token}))
                })
        }
    }, [selectedSC])

    return (
        <div style={{display: "block", width: "100%"}}>
            <TitleContainer
                title={Titles.Reporting}
                pad/>
            {config.qv_token
                ? window.origin.includes("apps.evenflow.ai") ? null : <QrveyEndUser settings={config}/>
                : null}
        </div>
    );
};

export default Reporting;
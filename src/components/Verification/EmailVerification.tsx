import React, {useEffect, useState} from "react";
import {useLocation, Redirect} from "react-router-dom";
import {Api} from "../../config/requests";

export const EmailVerification: React.FC = () => {
    const {search} = useLocation();
    const [state, setState] = useState({
        error: "", success: false, loading: true
    });
    const params = new URLSearchParams(search);
    const token = params.get('token');
    useEffect(() => {
        Api.call(
            Api.endpoints.Accounts.Verification, {data: {token}}
        ).then(r => {

        }).catch(e => {

        });

    }, [token]);

    return <div>
        {!token || state.error ? <Redirect to={"/"} /> : null}
    </div>;
}
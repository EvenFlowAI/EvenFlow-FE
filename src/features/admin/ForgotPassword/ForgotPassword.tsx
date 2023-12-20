import React, {useState} from "react";
import {useException} from "../../../utils/hooks";
import {API} from "../../../api/api";
import {ForgotPasswordForm} from "./ForgotPasswordForm/ForgotPassworfForm";
import {Message} from "./ForgotPasswordMessage/ForgotPasswordMessage";

export const ForgotPassword = () => {
    const [showMessage, changeShow] = useState(false);
    const [loading, setLoading] = useState();
    const [email, changeEmail] = useState('');
    const showError = useException();

    const handleChangeEmail: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
        = (e) => changeEmail(e.target.value);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await API.accounts.passwordRecovery({email});
            setLoading(false);
            changeShow(true);
        } catch (e) {
            showError(e);
            setLoading(false)
        }
    }

    return showMessage
        ? <Message />
        : <ForgotPasswordForm
            loading={loading}
            onChange={handleChangeEmail}
            onSubmit={handleSubmit}
            email={email}
        />;
}
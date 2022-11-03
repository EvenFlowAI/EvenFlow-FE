import React, {useState} from 'react';
import {TextField} from "../../UI/TextField";
import {Button, styled} from "@material-ui/core";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useException} from "../../../utils/hooks";

const Textarea = styled(TextField)({
    "& textarea": {
        padding: "8px 11px"
    }
});

type TMapIframeLinkProps = DialogProps & {
    onSave: (link: string) => void;
}

const MapIframeLink: React.FC<TMapIframeLinkProps> = ({onClose, open, onSave}) => {
    const {isLoading} = useSelector((state: RootState) => state.mobileService);
    const [iframeLink, setIframeLink] = useState<string>('')
    const [isError, setError] = useState<boolean>(false);
    const showError = useException();

    const handleLinkChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setIframeLink(value);
        setError(false);
    }

    const onCancel = () => {
        setIframeLink('');
        setError(false);
        onClose();
    }
    const onSaveClick = () => {
        if (iframeLink.length) {
            const iframeWrap = document.createElement('div');
            iframeWrap.innerHTML = iframeLink;
            const iframe = iframeWrap.querySelector('iframe');
            if (iframe?.src) onSave(iframe.src);
        } else {
            setError(true);
            showError('"iFrame Code Snippet" must not be empty')
        }
    }

    return (
        <BaseModal open={open} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Paste IFrame Code with Link to MapLine</DialogTitle>
            <DialogContent>
                <Textarea
                    fullWidth
                    multiline
                    error={isError}
                    placeholder="Past here"
                    label="IFrame Code Snippet"
                    onChange={handleLinkChange}
                    value={iframeLink}
                    rows={2}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    Cancel
                </Button>
                <LoadingButton
                    onClick={onSaveClick}
                    loading={isLoading}
                    variant="contained"
                    color="primary"
                >
                    Save
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default MapIframeLink;
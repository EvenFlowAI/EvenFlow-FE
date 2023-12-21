import React, {useState} from 'react';
import {Button} from "@material-ui/core";
import {DialogProps} from "../../../BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../BaseModal/BaseModal";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Textarea} from "./styles";
import {LoadingButton} from "../../../LoadingButton/LoadingButton";
import {useException} from "../../../../hooks/useException/useException";

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
            <DialogTitle onClose={onCancel}>Paste iFrame Code with Link to Mapline</DialogTitle>
            <DialogContent>
                <Textarea
                    isLowerCase
                    fullWidth
                    multiline
                    error={isError}
                    placeholder="Paste here"
                    label="iFRAME CODE SNIPPET"
                    style={{textTransform: 'none'}}
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
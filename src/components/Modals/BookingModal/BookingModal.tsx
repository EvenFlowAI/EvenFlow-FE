import React, {useMemo} from 'react';
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Box, Button, ButtonGroup} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {copyTextToClipboard, encodeSCID} from "../../../utils/utils";
import {Routes} from "../../../config/routes";
import {useCurrentUser, useMessage, useSCs} from "../../../utils/hooks";

export const BookingModal: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const {selectedSC} = useSCs();
    const showMessage = useMessage();
    const currentUser = useCurrentUser();

    const [link, frame] = useMemo(() => {
        const encoded = encodeSCID(selectedSC?.id??0);
        const url = window.location.origin + Routes.EndUser.Welcome + "/" + encoded + "?frame=1";
        const f: string = `<iframe id="evenflow-frame" class="booking-frame" src="${url}" width="100%" height="100%" style="border: none;" frameborder="0"></iframe>`;
        return [
            url,
            f
        ]
    }, [selectedSC]);

    const success = () => {
        showMessage("Copied to Clipboard");
    }

    const copyUrl = () => {
        copyTextToClipboard(link);
        success();
    }

    const copyFrame = () => {
        copyTextToClipboard(frame);
        success();
    }

    const handleGoTo = () => {
        window.open(link);
    }

    return <BaseModal {...props} maxWidth={"sm"}>
        <DialogTitle onClose={props.onClose}>Booking Info</DialogTitle>
        <DialogContent>
            <TextField
                label={"Direct link"}
                readOnly
                value={link}
                endAdornment={<ButtonGroup variant="text">
                    <Button onClick={copyUrl}>Copy</Button>
                    <Button color="primary" onClick={handleGoTo}>Open</Button>
                </ButtonGroup>}
                fullWidth />
            <Box p={2} />
            {currentUser?.role !== "Call Center Rep"
                ? <TextField
                label={"Frame"}
                readOnly
                fullWidth
                multiline
                endAdornment={<Button onClick={copyFrame}>Copy</Button>}
                value={frame}
                rows={4}
            />
                : null}
        </DialogContent>
        <DialogActions>
            <Button variant="contained" color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
};
import React from 'react';
import { ConfirmationTitle } from '../Title';
import {Checkbox, FormControlLabel, FormGroup, styled} from "@material-ui/core";


const FlexGroup = styled(FormGroup)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "32px",
    "& label": {
        marginRight: 0
    }
})

export const Reminders = () => {
    return (
        <div>
            <ConfirmationTitle>Reminders</ConfirmationTitle>
            <FlexGroup>
                <FormControlLabel
                    label="Text"
                    control={<Checkbox
                        // checked={false}
                        // onChange={handlePrivacyCheck("privacy")}
                        color="primary" />}
                />
                <FormControlLabel
                    label="E-mail"
                    control={<Checkbox
                        // checked={false}
                        // onChange={handlePrivacyCheck("privacy")}
                        color="primary" />}
                />
            </FlexGroup>
        </div>
    );
};
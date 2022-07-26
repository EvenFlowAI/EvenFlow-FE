import React, {Dispatch, useEffect, useState} from 'react';
import {TextField} from "../../../UI/TextField";
import {Button} from "@material-ui/core";
import {updatePackageDisclaimer} from "../../../../store/reducers/serviceCenters/actions";
import {useDispatch} from "react-redux";
import {useSCs} from "../../../../utils/hooks";

type TDisclaimerProps = {
    setDisclaimerOpen: Dispatch<React.SetStateAction<boolean>>;
}

const Disclaimer: React.FC<TDisclaimerProps> = ({setDisclaimerOpen}) => {
    const {selectedSC} = useSCs();
    const [disclaimer, setDisclaimer] = useState<string>('');
    const dispatch = useDispatch();

    const onDisclaimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisclaimer(e.target.value)
    }

    useEffect(() => {
        if (selectedSC?.maintenancePackageDisclaimer) setDisclaimer(selectedSC.maintenancePackageDisclaimer);
    }, [selectedSC])

    const handleCancel = () => {
        setDisclaimer(selectedSC?.maintenancePackageDisclaimer ?? '');
        setDisclaimerOpen(false);
    }

    const handleSave = () => {
        selectedSC && disclaimer?.length && dispatch(updatePackageDisclaimer(selectedSC.id, disclaimer))
    }

    return (
        <div>
            <TextField
                fullWidth
                multiline
                rows={2}
                value={disclaimer}
                style={{marginBottom: 20}}
                label="Maintenance Package Page Disclaimer (for Booking Flow)"
                placeholder="Enter Disclaimer Text"
                onChange={onDisclaimerChange}
            />
            <div style={{display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    variant="outlined"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    variant="contained"
                    onClick={handleSave}
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

export default Disclaimer;
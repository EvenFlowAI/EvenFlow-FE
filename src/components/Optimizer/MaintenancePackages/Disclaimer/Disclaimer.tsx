import React, {Dispatch, useCallback, useEffect, useState} from 'react';
import {TextField} from "../../../UI/TextField";
import {Button} from "@material-ui/core";
import {updatePackageDisclaimer} from "../../../../store/reducers/serviceCenters/actions";
import {useDispatch} from "react-redux";
import {useException, useMessage, useSCs} from "../../../../utils/hooks";
import {Loading} from "../../../UI/Loading";
import {LoadingButton} from "../../../UI/Button";

type TDisclaimerProps = {
    setDisclaimerOpen: Dispatch<React.SetStateAction<boolean>>;
}

const Disclaimer: React.FC<TDisclaimerProps> = ({setDisclaimerOpen}) => {
    const {selectedSC} = useSCs();
    const [disclaimer, setDisclaimer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const showMessage = useMessage();
    const showError = useException();

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

    const handleSave = useCallback(() => {
        setLoading(true);
        if (selectedSC && disclaimer?.length) {
            try {
                dispatch(updatePackageDisclaimer(selectedSC.id, disclaimer, () => showMessage('Disclaimer updated')))
            } catch (e) {
                showError(e)
            }
            finally {
                setLoading(false)
            }
        }
    }, [selectedSC, disclaimer, showError, dispatch, showMessage])

    return loading
        ? <Loading/>
        : <div>
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
                <LoadingButton
                    loading={loading}
                    style={{marginLeft: 16}}
                    color="primary"
                    variant="contained"
                    onClick={handleSave}
                >
                    Save
                </LoadingButton>
            </div>
        </div>;
};

export default Disclaimer;
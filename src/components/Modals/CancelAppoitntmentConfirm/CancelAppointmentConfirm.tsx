import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {DialogProps} from "../types";
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {Actions} from "../../AppointmentFlow/AppointmentFrame/Actions";
import {IAppointmentByQuery} from "../../../api/types";
import {API} from "../../../api/api";
import moment from "moment";
import {useException} from "../../../utils/hooks";
import {Loading} from "../../UI/Loading";
import {NoData} from "../../UI/NoData";
import {useDialogStyles} from "../DetailedFees/DetailedFees";
import {TCallback} from "../../../types/types";

const useStyles = makeStyles(theme => ({
    info: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    question: {
        marginTop: 20,
        textAlign: "center",
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30,
        [`${theme.breakpoints.down("sm")} and (orientation: portrait)`]: {
            '& > div': {
                flexDirection: 'column',
                padding: '0 16px',
                '& > button:first-child': {
                    order: 2
                }
            }
        }
    }
}))

const CancelAppointmentConfirm: React.FC<DialogProps&{hashKey: string, loadData: TCallback}> = ({open, onClose, hashKey, loadData}) => {
    const [data, setData] = useState<IAppointmentByQuery|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const showError = useException();
    const classes = useStyles();
    const dialogClasses = useDialogStyles();

    useEffect(() => {
        if (open) {
            setLoading(true)
            API.appointment.getByKey(hashKey)
                .then((res) => {
                if (res.data) setData(res.data);
            })
                .catch(err => showError(err))
                .finally(() => setLoading(false))
        }
    }, [hashKey, open])

    const handleSubmit = () => {
        setLoading(true)
        API.appointment.cancelByKey(hashKey)
            .then(() => {
                setLoading(false)
                loadData()
                onClose()
            })
            .catch(err => showError(err))
            .finally(() => setLoading(false))
    }

    return (
        <BaseModal
            width={800}
            open={open}
            style={{paddingBottom: 20}}
            onClose={onClose}
            classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose}/>
            {loading
                ? <Loading/>
                : data
                    ? <DialogContent>
                <div className={classes.info}>
                    <div className={classes.question}>
                        Confirm cancellation of Appointment on {moment(data?.dateInUtc).format("dddd")}
                        <div>{moment(data?.dateInUtc).format("MMMM D, YYYY")} at {moment(data?.timeSlot, "hh:mm:ss").format("hh:mm A")} for customer {data.driver.fullName}</div>
                    </div>
                </div>
            </DialogContent>
                    : <NoData/>}
            <div className={classes.actionsWrapper}>
                <Actions
                    nextDisabled={loading}
                    prevDisabled={loading}
                    onBack={onClose}
                    onNext={handleSubmit}
                    nextLabel="Cancel Appointment"
                    prevLabel="Back"
                />
            </div>
        </BaseModal>
    );
};

export default CancelAppointmentConfirm;
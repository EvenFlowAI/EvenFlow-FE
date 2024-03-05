import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {ActionButtons} from "../../ActionButtons/ActionButtons";
import {IAppointmentByQuery} from "../../../../api/types";
import {API} from "../../../../api/api";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {NoData} from "../../../../components/wrappers/NoData/NoData";
import {useDialogStyles} from "../../../../hooks/styling/useDialogStyles";
import {TArgCallback} from "../../../../types/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useStyles} from "./styles";
import {useException} from "../../../../hooks/useException/useException";
import dayjs from "dayjs";

const CancelAppointmentModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps&{hashKey: string, loadData: TArgCallback<boolean>}>>> = ({open, onClose, hashKey, loadData}) => {
    const {customerSearchData} = useSelector((state: RootState) => state.customers);
    const [data, setData] = useState<IAppointmentByQuery|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const showError = useException();
    const { classes  } = useStyles();
    const {classes: dialogClasses} = useDialogStyles();

    useEffect(() => {
        if (open && hashKey) {
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
        const requestFunc = hashKey.includes('by-key') ? API.appointment.cancelFromEmail : API.appointment.cancelByKey
        requestFunc(hashKey)
            .then(() => {
                setLoading(false)
                loadData(Boolean(customerSearchData.firstName.length || customerSearchData.lastName.length))
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
                        Confirm cancellation of Appointment on {dayjs.utc(data?.dateInUtc).format("dddd")}
                        <div>{dayjs.utc(data?.dateInUtc).format("ddd, MMMM D, YYYY")} at {dayjs(data?.timeSlot, "hh:mm:ss").format("hh:mm A")} for customer {data.driver.fullName}</div>
                    </div>
                </div>
            </DialogContent>
                    : <NoData/>}
            <div className={classes.actionsWrapper}>
                <ActionButtons
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

export default CancelAppointmentModal;
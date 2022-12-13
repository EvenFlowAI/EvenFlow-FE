import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {loadRecallsByVin} from "../../../store/reducers/recall/actions";
import {decodeSCID} from "../../../utils/utils";
import {DialogProps} from "../types";
import {Loading} from "../../UI/Loading";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Divider, FormControlLabel, Switch, withStyles} from "@material-ui/core";
import {IRecallByVin} from "../../AppointmentFlow/AppointmentFrame/types";
import moment from "moment";

const useStyles = makeStyles(() => ({
    mainTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    vinData: {
        fontSize: 20,
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        color: "#142EA1",
        textTransform: "uppercase",
    },
    serviceAddedBtn: {
        width: "30%",
        display: 'flex',
        alignItems: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    recallComponent: {
        fontSize: 16,
        color: "#828282",
        fontWeight: 600,
        textTransform: 'uppercase',
    },
    label: {
        fontWeight: "bold",
    },
    data: {
        fontWeight: "normal",
    },
    status: {
        color: "red",
    },
    recallTitleWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    recallDetailsWrapper: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridGap: 10,
        marginBottom: 20,
    },
    textBox: {
        marginBottom: 20,
    },
    actionsWrapper: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        '& > button:not(:first-child)': {
            marginLeft: 20,
        }
    }
}))

const Label = withStyles({
    root: {
        marginLeft: 0,
    },
    label: {
        fontWeight: "bold"
    }
})(FormControlLabel);

const RecallsByVin: React.FC<DialogProps> = ({open, onClose}) => {
    const {recallsByVin, isLoading} = useSelector((state: RootState) => state.recalls);
    const {selectedVehicle} = useSelector((state: RootState) => state.appointmentFrame);
    const [selectedRecallsIds, setSelectedRecallsIds] = useState<number[]>([]);
    const dispatch = useDispatch();
    const {id} = useParams();
    const {t} = useTranslation();
    const classes = useStyles();

    useEffect(() => {
        if (selectedVehicle?.vin?.length && open) {
            dispatch(loadRecallsByVin(decodeSCID(id), selectedVehicle.vin))
        }
    }, [selectedVehicle, open])

    const onAddService = (item: IRecallByVin) => {
        setSelectedRecallsIds(prev => {
            if (prev.includes(item.serviceRequestId)) {
                return prev.filter(el => el !== item.serviceRequestId)
            } else return [...prev, item.serviceRequestId]
        })
    }

    const onDecline = () => {
        setSelectedRecallsIds([]);
        onClose();
    }

    const onSubmit = () => {

    }

    return (
        <BaseModal open={open} onClose={onClose} width={800}>
            <DialogTitle onClose={onClose} style={{justifyContent: "flex-start"}}>
            </DialogTitle>
            {
                isLoading
                    ? <Loading/>
                    : <DialogContent>
                        <div className={classes.mainTitle}>{recallsByVin.length} {t("Unrepaired")} {recallsByVin.length > 1 ? t("Recalls") : t("Recall")}</div>
                        <div className={classes.vinData}>{t("associated with this VIN")}: {selectedVehicle?.vin}</div>
                        {recallsByVin.map((item, index) => (
                            <>
                            <div>
                                <div className={classes.recallTitleWrapper} key={item.recallComponent}>
                                    <div>
                                        <div className={classes.title}>{index + 1} {t("Recall")}</div>
                                        <div className={classes.recallComponent}>{item.shortDescription}</div>
                                    </div>
                                    <div className={classes.serviceAddedBtn}>
                                        <Label
                                            checked={selectedRecallsIds.includes(item.serviceRequestId)}
                                            onChange={() => onAddService(item)}
                                            label={selectedRecallsIds.includes(item.serviceRequestId) ? t("Service Added") : t("Service Declined")}
                                            labelPlacement="start"
                                            control={<Switch color="primary" />}
                                        />
                                    </div>
                                </div>
                                <div className={classes.recallDetailsWrapper}>
                                    <div>
                                        <div className={classes.label}>{t("Recall Open Date")}</div>
                                        <div className={classes.data}>{moment(item.recallOpenDate).format("MM DD, YYYY")}</div>
                                    </div>
                                    <div>
                                        <div className={classes.label}>{t("NHTSA Recall Number")}</div>
                                        <div className={classes.data}>{item.nhtsaRecallNumber}</div>
                                    </div>
                                    <div>
                                        <div className={classes.label}>{t("Recall Component")}</div>
                                        <div className={classes.data}>{item.recallComponent}</div>
                                    </div>
                                    <div>
                                        <div className={classes.label}>{t("Recall Status")}</div>
                                        <div className={classes.data}>{item.recallStatus}</div>
                                    </div>
                                </div>
                                <div className={classes.textBox}>
                                    <div className={classes.label}>{t("Summary")}</div>
                                    <div>{item.summary}</div>
                                </div>
                                <div className={classes.textBox}>
                                    <div className={classes.label}>{t("Safety Risk")}</div>
                                    <div>{item.safetyRisk}</div>
                                </div>
                            </div>
                                {recallsByVin.length > 1 && index < recallsByVin.length - 1 ? <Divider style={{marginBottom: 20}}/> : null}
                            </>))}
                    </DialogContent>
            }
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <Button variant="outlined" onClick={onDecline}>
                        {t("Decline")}
                    </Button>
                    <Button  variant="contained" onClick={onSubmit} color="primary">
                        {t("Add Service")}
                    </Button>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default RecallsByVin;
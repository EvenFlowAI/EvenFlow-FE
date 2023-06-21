import React, {useEffect} from 'react';
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
import {setSelectedRecalls} from "../../../store/reducers/appointmentFrameReducer/actions";

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
        width: "35%",
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

const CustomSwitch = withStyles({
    thumb: {
        color: 'white',
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1), 0px 3px 4px rgba(0, 0, 0, 0.3)",
        border: '1px solid #DADADA'
    },
    track: {
        backgroundColor: '#D3D3D3'
    }
})(Switch)


type TRecallsByVinProps = DialogProps & {
    handleNext : () => void,
    onDeclineRecalls: () => void,
}

const RecallsByVin: React.FC<TRecallsByVinProps> = ({open, onClose, handleNext, onDeclineRecalls}) => {
    const {recallsByVin, isLoading} = useSelector((state: RootState) => state.recalls);
    const {selectedVehicle, selectedRecalls, makes} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const {id} = useParams();
    const {t} = useTranslation();
    const classes = useStyles();

    useEffect(() => {
        if (selectedVehicle) {
            const make = makes.find(item => item.name === selectedVehicle.make);
            if (selectedVehicle.vin?.length && open && make?.id) {
                dispatch(loadRecallsByVin(decodeSCID(id), selectedVehicle.vin, make.id))
            }
        }
    }, [selectedVehicle, open, makes])

    useEffect(() => {
        if (open) dispatch(setSelectedRecalls(recallsByVin));
    }, [recallsByVin, open])

    const onAddService = (item: IRecallByVin) => {
        const data = selectedRecalls.find(el => el.nhtsaRecallNumber === item.nhtsaRecallNumber)
            ? selectedRecalls.filter(el => el.nhtsaRecallNumber !== item.nhtsaRecallNumber)
            : [...selectedRecalls, item]
        dispatch(setSelectedRecalls(data));
    }

    const onDecline = () => {
        dispatch(setSelectedRecalls([]))
        onDeclineRecalls()
        onClose();
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
                        <div className={classes.vinData}>{t("associated with VIN")}: {selectedVehicle?.vin}</div>
                        {recallsByVin.map((item, index) => (
                            <React.Fragment key={item.nhtsaRecallNumber}>
                            <div>
                                <div className={classes.recallTitleWrapper}>
                                    <div>
                                        <div className={classes.title}>{index + 1} {t("Recall")}</div>
                                        <div className={classes.recallComponent}>{item.shortDescription}</div>
                                    </div>
                                    <div className={classes.serviceAddedBtn}>
                                        <Label
                                            checked={Boolean(selectedRecalls.find(el => el.nhtsaRecallNumber === item.nhtsaRecallNumber))}
                                            onChange={() => onAddService(item)}
                                            label={selectedRecalls.find(el => el.nhtsaRecallNumber === item.nhtsaRecallNumber)
                                                ? t("Service Added")
                                                : t("Service Declined")}
                                            labelPlacement="start"
                                            control={<CustomSwitch color="primary" />}
                                        />
                                    </div>
                                </div>
                                <div className={classes.recallDetailsWrapper}>
                                    <div>
                                        <div className={classes.label}>{t("Recall Open Date")}</div>
                                        <div className={classes.data}>{moment(item.recallOpenDate).format("MMM DD, YYYY")}</div>
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
                                        <div className={classes.data} style={{color: 'red'}}>{item.recallStatus}</div>
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
                            </React.Fragment>))}
                    </DialogContent>
            }
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <Button variant="outlined" onClick={onDecline}>
                        {t("Decline")}
                    </Button>
                    <Button  variant="contained" onClick={handleNext} color="primary" disabled={!selectedRecalls.length}>
                        {t("Add Service")}
                    </Button>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default RecallsByVin;
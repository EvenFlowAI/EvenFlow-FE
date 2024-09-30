import React, {useEffect, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {loadRecallsByVin} from "../../../store/reducers/recall/actions";
import {decodeSCID} from "../../../utils/utils";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {Loading} from "../../../components/wrappers/Loading/Loading";
import {Button, Divider} from "@mui/material";
import {
    checkCarIsValid,
    setAdditionalServicesChosen,
    setSelectedRecalls
} from "../../../store/reducers/appointmentFrameReducer/actions";
import AskAddService from "../../../components/modals/booking/AskAddService/AskAddService";
import {checkPodChanged} from "../../../store/reducers/appointments/actions";
import {CustomSwitch, Label, useStyles} from "./styles";
import {IRecallByVin} from "../../../types/types";
import {useModal} from "../../../hooks/useModal/useModal";
import {useException} from "../../../hooks/useException/useException";
import dayjs from "dayjs";
import {BfButtonsWrapper} from "../../../components/styled/BfButtonsWrapper";

type TRecallsByVinProps = DialogProps & {
    handleNext : () => void,
    onDeclineRecalls: () => void,
    handleAddServices: () => void,
}

const RecallsByVinModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TRecallsByVinProps>>> = ({open, onClose, handleNext, onDeclineRecalls, handleAddServices}) => {
    const {recallsByVin, isLoading} = useSelector((state: RootState) => state.recalls);
    const {selectedVehicle, makes, isUsualFlowNeeded} = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const [recalls, setRecalls] = useState<IRecallByVin[]>([]);
    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();
    const showError = useException();
    const {t} = useTranslation();
    const { classes  } = useStyles();
    const {isOpen: isAddServiceOpen, onClose: onAddServiceClose, onOpen: onAddServiceOpen} = useModal();

    useEffect(() => {
        if (selectedVehicle) {
            const make = makes.find(item => item.name.toLowerCase() === selectedVehicle.make?.toLowerCase());
            const model = make?.modelCodes?.find(el => el.name.toLowerCase() === selectedVehicle.model.toLowerCase())
            if (selectedVehicle.vin?.length && open && make?.id && model && selectedVehicle.year) {
                dispatch(loadRecallsByVin(decodeSCID(id), selectedVehicle.vin, make.id, model.id, selectedVehicle.year))
            }
        }
    }, [selectedVehicle, open, makes])

    useEffect(() => {
        if (open) setRecalls(recallsByVin);
    }, [recallsByVin, open])

    const onAddService = (item: IRecallByVin) => {
        const data = recalls.find(el => el.campaignNumber === item.campaignNumber)
            ? recalls.filter(el => el.campaignNumber !== item.campaignNumber)
            : [...recalls, item]
        setRecalls(data)
    }

    const onDecline = () => {
        dispatch(setSelectedRecalls([]))
        setRecalls([]);
        onDeclineRecalls()
        onClose();
    }

    const handleYes = () => {
        dispatch(setAdditionalServicesChosen(true));
        onAddServiceClose();
        handleAddServices();
        onClose();
    }

    const handleNo = () => {
        onAddServiceClose();
        handleNext();
        onClose();
    }

    const onCarIsValid = () => dispatch(checkPodChanged(decodeSCID(id), showError))

    const onCarIsInvalid = () => {
        handleNext();
        onClose();
    }

    const handleSubmit = () => {
        dispatch(setSelectedRecalls(recalls))
        if (customerLoadedData?.isUpdating && !isUsualFlowNeeded) {
            dispatch(checkCarIsValid(onCarIsValid, onCarIsInvalid))
        } else {
            onAddServiceOpen()
        }
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
                            <React.Fragment key={item.campaignNumber}>
                                <div>
                                    <div className={classes.recallTitleWrapper}>
                                        <div>
                                            <div className={classes.title}>{index + 1} {t("Recall")}</div>
                                            <div className={classes.recallComponent}>{item.shortDescription}</div>
                                        </div>
                                        <div className={classes.serviceAddedBtn}>
                                            <Label
                                                checked={Boolean(recalls.find(el => el.campaignNumber === item.campaignNumber))}
                                                onChange={() => onAddService(item)}
                                                label={recalls.find(el => el.campaignNumber === item.campaignNumber)
                                                    ? t("Service Added")
                                                    : t("Service Declined")}
                                                labelPlacement="start"
                                                control={<CustomSwitch color="primary" />}
                                            />
                                        </div>
                                    </div>
                                    <div className={classes.recallDetailsWrapper}>
                                        {item.recallOpenDate
                                            ? <div>
                                                <div className={classes.label}>{t("Recall Open Date")}</div>
                                                <div className={classes.data}>
                                                    {dayjs(item.recallOpenDate).format("MMM DD, YYYY")}
                                                </div>
                                            </div>
                                            : null}
                                        <div>
                                            <div className={classes.label}>{t("Campaign Number")}</div>
                                            <div className={classes.data}>{item.campaignNumber}</div>
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
                                    {item.summary
                                        ? <div className={classes.textBox}>
                                            <div className={classes.label}>{t("Summary")}</div>
                                            <div>{item.summary}</div>
                                        </div>
                                        : null}
                                    {item.safetyRisk
                                        ? <div className={classes.textBox}>
                                            <div className={classes.label}>{t("Safety Risk")}</div>
                                            <div>{item.safetyRisk}</div>
                                        </div>
                                        : null}
                                </div>
                                {recallsByVin.length > 1 && index < recallsByVin.length - 1 ? <Divider style={{marginBottom: 20}}/> : null}
                            </React.Fragment>))}
                    </DialogContent>
            }
            <BfButtonsWrapper>
                <Button variant="outlined" onClick={onDecline}>
                    {t("Decline")}
                </Button>
                <Button  variant="contained" onClick={handleSubmit} color="primary" disabled={!recalls.length}>
                    {t("Add Service")}
                </Button>
            </BfButtonsWrapper>
            <AskAddService onSave={handleYes} onClose={handleNo} open={isAddServiceOpen}/>
        </BaseModal>
    );
};

export default RecallsByVinModal;
import React, {useCallback, useEffect, useState} from 'react';
import {Loading} from "../../UI/Loading";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import axios from "axios";
import {useException} from "../../../utils/hooks";
import PackageEMenuActions from "./PackageEmenuActions";

type TProps = {
    onBack: () => void,
    onNext: () => void,
}

const primaryString = 'https://prodfix.emenusautomotive.com/my/index.php?go=api.pdf&';

const PackagesEmenu: React.FC<TProps> = ({onBack, onNext}) => {
    const {selectedVehicle, makes} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [srcLink, setSrcLink] = useState<string>('');
    const showError = useException();

    const getStringByModel = useCallback((str): string => {
        if (selectedVehicle) {
            const modelCodes = makes.find(item => item.name === selectedVehicle.make)?.modelCodes;
            const modelId = modelCodes?.find(item => item.name === selectedVehicle.model)?.code;
            if (modelId) str = str + `model=${modelId}&`;
            if (selectedVehicle.year) str = str + `year=${selectedVehicle.year}&`;
        }
        return str;
    }, [makes, selectedVehicle])

    const handleWrongVinError = useCallback(() => {
        if (selectedVehicle) {
            setLoading(true);
            let str = getStringByModel(primaryString);
             if (str !== primaryString) {
                 if (selectedVehicle.mileage) str = str + `mileage_service_type=${selectedVehicle.mileage}TC`;

                 axios.get(str, {headers: { 'Subscription-Id': scProfile?.dmsId ?? ""}, responseType: "arraybuffer"})
                     .then(res => {
                         if (res.data) {
                             const file = new Blob([res.data], {type: 'application/pdf'});
                             const fileURL = URL.createObjectURL(file);
                             setSrcLink(fileURL)
                         }
                     })
                     .catch(err => {
                         showError(err)
                         console.log(err)
                     })
                     .finally(() => setLoading(false));
             }
        }
    }, [setLoading, selectedVehicle, scProfile])

    useEffect(() => {
        let str = primaryString;
        setLoading(true);
        if (selectedVehicle?.model) {
            if (selectedVehicle.vin) {
                str = str + `vin=${selectedVehicle.vin}&`
            } else {
                str = getStringByModel(str);
            }
            if (selectedVehicle.mileage) str = str + `mileage_service_type=${selectedVehicle.mileage}TC`;

            axios.get(str, {headers: { 'Subscription-Id': scProfile?.dmsId ?? ""}, responseType: "arraybuffer"})
                .then(res => {
                    if (res.data) {
                        const file = new Blob([res.data], {type: 'application/pdf'});
                        const fileURL = URL.createObjectURL(file);
                        setSrcLink(fileURL)
                    }
                })
                .catch(err => {
                    console.log(err)
                    if (err.response?.status === 400) handleWrongVinError();
                })
                .finally(() => setLoading(false));
        }
    }, [selectedVehicle, scProfile])

    return isLoading
        ? <Loading/>
        :  <React.Fragment>
            <PackageEMenuActions onBack={onBack} isLoading={isLoading} onNext={onNext}/>
            <iframe src={srcLink} width="100%" style={{height: '75vh'}} id="e-menu"/></React.Fragment>
};

export default PackagesEmenu;
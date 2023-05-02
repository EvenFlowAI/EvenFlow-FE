import React, {useEffect, useState} from 'react';
import {Loading} from "../../UI/Loading";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import axios from "axios";
import {useException} from "../../../utils/hooks";

const PackagesEmenu = () => {
    const {selectedVehicle, makes} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [srcLink, setSrcLink] = useState<string>('');
    const showError = useException();

    useEffect(() => {
        let str = 'https://prodfix.emenusautomotive.com/my/index.php?go=api.pdf&';
        setLoading(true);
        if (selectedVehicle?.model) {
            if (selectedVehicle.vin?.length === 16) {
                str = str + `&vin=${selectedVehicle.vin}`
            } else {
                const models = makes.find(item => item.name === selectedVehicle.make)?.modelCodes;
                const modelId = models?.find(item => item.name === selectedVehicle.model)?.id;
                if (modelId) str = str + `model=${modelId}&`;
                if (selectedVehicle.year) str = str + `year=${selectedVehicle.year}&`;
            }

            if (selectedVehicle.mileage) str = str + `mileage_service_type=${selectedVehicle.mileage}TC`;

            axios.get(str, {headers: { 'Subscription-Id': scProfile?.dmsId ?? ""}, responseType: "arraybuffer"})
                .then(res => {
                    if (res.data) {
                        console.log(res.data)
                        const file = new Blob([res.data], {type: 'application/pdf'});
                        console.log(file);
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
    }, [selectedVehicle, scProfile])

    return isLoading
        ? <Loading/>
        : <iframe src={srcLink} width="100%" style={{height: '50vh'}} id="e-menu"/>;
};

export default PackagesEmenu;
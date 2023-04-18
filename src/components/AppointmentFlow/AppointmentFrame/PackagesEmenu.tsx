import React, {useEffect, useState} from 'react';
import {Loading} from "../../UI/Loading";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";

const PackagesEmenu = () => {
    const {selectedVehicle, makes} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [srcLink, setSrcLink] = useState<string>('');

    useEffect(() => {
        let str = 'http://www.emenusllc.com/index.php?go=member.pdfTH&pdfType=threeUp&service_type=1&';
        if (selectedVehicle?.model) {
            const models = makes.find(item => item.name === selectedVehicle.make)?.modelCodes;
            const modelId = models?.find(item => item.name === selectedVehicle.model)?.id;
            if (modelId) str = str + `model=${modelId}&`;
            if (scProfile?.dmsId) str = str + `member=${scProfile.dmsId}&`;
            if (selectedVehicle.year) str = str + `year=${selectedVehicle.year}&`;
            if (selectedVehicle.mileage) str = str + `mileage_service_type=${selectedVehicle.mileage}TC`;
            if (selectedVehicle.vin?.length === 16) str = str + `&vin=${selectedVehicle.vin}`;
            setSrcLink(str);
        }
    }, [selectedVehicle, scProfile])
    // todo delete mock src

    const src = 'http://www.emenusllc.com/index.php?go=member.pdfTH&pdfType=threeUp&service_type=1&model=43&member=2437&year=2010&mileage_service_type=30000TC';
    return isLoading
        ? <Loading/>
        : <iframe src={srcLink} width="100%" style={{height: '50vh'}} id="e-menu">
        </iframe>;
};

export default PackagesEmenu;
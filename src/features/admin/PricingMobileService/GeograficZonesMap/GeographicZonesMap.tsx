import React from 'react';
import {Button} from "@mui/material";
import EligibleCustomerSegment from "../EligibleCustomerSegment/EligibleCustomerSegment";
import MapIframeLink from "../../../../components/modals/admin/MapIframeLink/MapIframeLink";
import {useDispatch} from "react-redux";
import {saveLinkToMobServiceMap} from "../../../../store/reducers/mobileService/actions";
import {useStyles} from "./styles";
import {ButtonsWrapper} from "../../../../components/buttons/GeographicZonesButtons/styles";
import {EligibleTitle} from "../../../../components/styled/EligibleTitle";
import {GeographicZonesWrapper, TabHeaderWrapper} from "../../../../components/styled/GeographicZonesWrappers";
import {useModal} from "../../../../hooks/useModal/useModal";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const mockSRC = 'https://app.mapline.com/map/map_36c1b7f/Pz8UPz4ZIEJDfz8UPxAUP1kAMD8vJT8UPz8UPz8GQkxGCD8tPz'

const GeographicZonesMap = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showMessage = useMessage();
    const showError = useException();

    const onSuccess = (): void => showMessage('Map updated')

    const onSaveLink = (link: string) => {
        if (selectedSC) dispatch(saveLinkToMobServiceMap(selectedSC.id, link, (err) => showError(err), onSuccess))
    }

    return (
        <div>
            <TabHeaderWrapper>
                <ButtonsWrapper>
                    <Button onClick={onOpen} variant="contained" color="primary">Update Map</Button>
                </ButtonsWrapper>
            </TabHeaderWrapper>
            <EligibleTitle>Eligible Customer Type</EligibleTitle>
            <GeographicZonesWrapper>
                <div style={{width: '33%'}}>
                    <EligibleCustomerSegment/>
                </div>
                <div className={classes.wrapper}>
                    <iframe src={mockSRC}/>
                </div>
            </GeographicZonesWrapper>
            <MapIframeLink onClose={onClose} open={isOpen} onSave={onSaveLink}/>
        </div>
    );
};

export default GeographicZonesMap;
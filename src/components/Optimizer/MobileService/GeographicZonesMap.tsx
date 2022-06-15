import React from 'react';
import {ButtonsWrapper, TabHeaderWrapper, ZonesWrapper, Title} from "./styledComponents";
import {Button} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";
import {useModal} from "../../../utils/hooks";
import MapIframeLink from "../../Modals/MapIframeLink/MapIframeLink";

const GeographicZonesMap = () => {
    const {onOpen, onClose, isOpen} = useModal();

    return (
        <div>
            <TabHeaderWrapper>
                <ButtonsWrapper>
                    <Button onClick={onOpen} variant="contained" color="primary" style={{width: 160}}>Update Map</Button>
                </ButtonsWrapper>
            </TabHeaderWrapper>
            <Title>Eligible Customer Type</Title>
            <ZonesWrapper>
                <div style={{width: '30%'}}>
                    <EligibleCustomerSegment/>
                </div>
                <div style={{width: '70%'}}>
                    <iframe src='https://app.mapline.com/map/map_36c1b7f/Pz8UPz4ZIEJDfz8UPxAUP1kAMD8vJT8UPz8UPz8GQkxGCD8tPz'
                            style={{width: '100%', height :500 }}/>
                    <div style={{fontSize: 10}}><a href='https://mapline.com' target='_blank'>Mapping by Mapline</a></div>
                </div>
            </ZonesWrapper>
            <MapIframeLink onClose={onClose} open={isOpen}/>
        </div>
    );
};

export default GeographicZonesMap;
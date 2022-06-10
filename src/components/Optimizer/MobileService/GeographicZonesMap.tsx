import React from 'react';
import {ButtonsWrapper, TabHeaderWrapper, ZonesWrapper, Title} from "./styledComponents";
import {Button} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";

type TGeographicZonesMapProps = {
    onAddZoneOpen: () => void;
}

const GeographicZonesMap: React.FC<TGeographicZonesMapProps> = ({onAddZoneOpen}) => {
    return (
        <div>
            <TabHeaderWrapper>
                <ButtonsWrapper>
                    <Button onClick={onAddZoneOpen} variant="contained" color="primary" style={{width: 160}}>Add Zone</Button>
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
        </div>
    );
};

export default GeographicZonesMap;
import React from 'react';
import {ButtonsWrapper, TabHeaderWrapper, ZonesWrapper, Title} from "./styledComponents";
import {Button} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";
import {useModal} from "../../../utils/hooks";
import MapIframeLink from "../../Modals/MapIframeLink/MapIframeLink";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    wrapper: {
        width: '70%',
        '& > iframe': {
            width: '100%',
            height: 548,
        },
        '& > div': {
            fontSize: 10
        }
    }
}))

const mockSRC = 'https://app.mapline.com/map/map_d5743b1/Pz8UfT8UGD9CXT8UJz9vTz8UPz8UPz8UPz8UHz8GY2YuRnUUWD'

const GeographicZonesMap = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const classes = useStyles();

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
                <div className={classes.wrapper}>
                    <iframe src={mockSRC}/>
                </div>
            </ZonesWrapper>
            <MapIframeLink onClose={onClose} open={isOpen}/>
        </div>
    );
};

export default GeographicZonesMap;
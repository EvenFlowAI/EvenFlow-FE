import React from 'react';
import {ButtonsWrapper, TabHeaderWrapper, ZonesWrapper, Title} from "./styledComponents";
import {Button} from "@material-ui/core";
import EligibleCustomerSegment from "./EligibleCustomerSegment";
import {useException, useMessage, useModal, useSCs} from "../../../utils/hooks";
import MapIframeLink from "../../Modals/MapIframeLink/MapIframeLink";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {saveLinkToServiceValetMap} from "../../../store/reducers/serviceValet/actions";

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

const mockSRC = 'https://app.mapline.com/map/map_36c1b7f/Pz8UPz4ZIEJDfz8UPxAUP1kAMD8vJT8UPz8UPz8GQkxGCD8tPz'

const GeographicZonesMap = () => {
    const {onOpen, onClose, isOpen} = useModal();
    const classes = useStyles();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const showMessage = useMessage();
    const showError = useException();

    const onSuccess = (): void => showMessage('Map updated')

    const onSaveLink = (link: string) => {
        if (selectedSC) dispatch(saveLinkToServiceValetMap(selectedSC.id, link, (err) => showError(err), onSuccess))
    }

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
            <MapIframeLink onClose={onClose} open={isOpen} onSave={onSaveLink}/>
        </div>
    );
};

export default GeographicZonesMap;
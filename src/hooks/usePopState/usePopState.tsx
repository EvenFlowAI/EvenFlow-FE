import React, {useEffect} from 'react';
import {setWelcomeScreenView} from "../../store/reducers/appointmentFrameReducer/actions";
import {decodeSCID} from "../../utils/utils";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {TCallback} from "../../types/types";

const usePopState = (onPopState?: TCallback) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {id} = useParams<{id: string}>();
    const dispatch = useDispatch();

    const listenToPopState = () => {
        debugger
        dispatch(setWelcomeScreenView("select"))
        onPopState && onPopState();
    }

    useEffect(() => {
        if ((!id || !decodeSCID(id) && !scProfile?.id)) {
            window.location.href = "/";
        }
        window.addEventListener("popstate", listenToPopState);
        return () => {
            window.removeEventListener("popstate", listenToPopState);
        }
    }, [id, scProfile]);
};

export default usePopState;
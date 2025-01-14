import React, { useEffect } from 'react';
import { setWelcomeScreenView } from '../../store/reducers/appointmentFrameReducer/actions';
import { decodeSCID } from '../../utils/utils';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { TCallback, TView } from '../../types/types';

const usePopState = (screen: TView, onPopState?: TCallback, keepListener?: boolean) => {
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const listenToPopState = () => {
    dispatch(setWelcomeScreenView(screen));
    onPopState && onPopState();
  };

  useEffect(() => {
    if (!id || (!decodeSCID(id) && !scProfile?.id)) {
      window.location.href = '/';
    }
    window.addEventListener('popstate', listenToPopState);
    return () => {
      keepListener && window.removeEventListener('popstate', listenToPopState);
    };
  }, [id, scProfile]);
};

export default usePopState;

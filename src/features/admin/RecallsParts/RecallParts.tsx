import React, { ChangeEvent, useEffect, useState } from 'react';
import RecallTable from './RecallTable/RecallTable';
import { Autocomplete } from '@mui/material';
import AddRecallModal from './AddRecallModal/AddRecallModal';
import { IRecall, TIdName } from '../../../store/reducers/recall/types';
import { autocompleteRender } from '../../../utils/autocompleteRenders';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { loadAllAssignedServiceRequests } from '../../../store/reducers/serviceRequests/actions';
import { IAssignedServiceRequest } from '../../../store/reducers/serviceRequests/types';
import { updateDefaultRecallOpsCode } from '../../../store/reducers/serviceCenters/actions';
import { useModal } from '../../../hooks/useModal/useModal';
import { useException } from '../../../hooks/useException/useException';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useInputStyles, useStyles } from './styles';
import { SearchDebounced } from '../../../components/formControls/SearchDebounced/SearchDebounced';
import { setRecallPageData, setRecallSearch } from '../../../store/reducers/recall/actions';
import MakesForm from './MakesForm/MakesForm';
import { loadAllGlobalMakes } from '../../../store/reducers/globalVehicles/actions';

const RecallParts = () => {
  const [currentItem, setCurrentItem] = useState<IRecall | null>(null);
  const [selectedOpsCode, setSelectedOpsCode] = useState<IAssignedServiceRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [defaultOpsDropdownOpenCount, setDefaultOpsDropdownOpenCount] = useState(0);
  const { selectedSC } = useSCs();
  const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
  const { isOpen, onOpen, onClose } = useModal();
  const { classes } = useStyles();
  const { classes: inputClasses } = useInputStyles();
  const dispatch = useDispatch();
  const showError = useException();
  const [makes, setMakes] = useState<TIdName[]>([]);

  useEffect(() => {
    return () => {
      dispatch(setRecallSearch(''));
      dispatch(setRecallPageData({ pageIndex: 0, pageSize: 10 }));
    };
  }, []);

  useEffect(() => {
    if (selectedSC && allAssignedList) {
      const opsCode = allAssignedList.find(item => item.id === selectedSC.recallServiceRequestId);
      setSelectedOpsCode(opsCode ?? null);
    }
  }, [allAssignedList, selectedSC]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadAllAssignedServiceRequests(selectedSC.id));
      dispatch(loadAllGlobalMakes());
    }
  }, [selectedSC]);

  // clear the search term when navigating to another page
  useEffect(() => {
    return () => {
      dispatch(setRecallSearch(''));
    };
  }, []);

  const handleAddRecall = () => {
    onOpen();
  };

  const onSRChange = (e: ChangeEvent<{}>, value: IAssignedServiceRequest | null) => {
    setLoading(true);
    if (selectedSC && value) {
      setSelectedOpsCode(value);
      try {
        dispatch(updateDefaultRecallOpsCode(selectedSC.id, value?.id));
      } catch (err) {
        showError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onSearch = () => {
    dispatch(setRecallSearch(search.trim()));
    dispatch(setRecallPageData({ pageIndex: 0, pageSize: 10 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className={classes.wrapper}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Autocomplete
            classes={inputClasses}
            style={{ width: 210 }}
            loading={loading}
            value={selectedOpsCode}
            options={allAssignedList}
            onOpen={() => setDefaultOpsDropdownOpenCount(prev => prev + 1)}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            getOptionLabel={o => o.serviceRequest.code}
            onChange={onSRChange}
            renderInput={autocompleteRender({
              label: 'default recall op code:',
              placeholder: 'Select Op Code',
            })}
          />
          <MakesForm
            selectedMakes={makes}
            setMakes={setMakes}
            hasDefaultRecallOpsCode={Boolean(selectedOpsCode)}
            clearSelectionErrorTrigger={defaultOpsDropdownOpenCount}
          />
        </div>
        <SearchDebounced
          onSearch={onSearch}
          onChange={handleSearchChange}
          style={{ height: 40, width: 334 }}
          value={search}
          placeholder="Search ..."
        />
        {/*<Button*/}
        {/*  className={classes.button}*/}
        {/*  color="primary"*/}
        {/*  variant="contained"*/}
        {/*  onClick={handleAddRecall}*/}
        {/*>*/}
        {/*  Add Recall*/}
        {/*</Button>*/}
      </div>
      <RecallTable
        onOpenModal={handleAddRecall}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        selectedMakes={makes}
      />
      <AddRecallModal
        open={isOpen}
        editingItem={currentItem}
        onClose={onClose}
        setEditingItem={setCurrentItem}
      />
    </>
  );
};

export default RecallParts;

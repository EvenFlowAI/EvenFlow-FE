/* eslint-disable max-lines */

import React, { useEffect } from 'react';
import { useStyles } from './styles';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { Autocomplete, Button } from '@mui/material';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import {
  getAvailablePhoneNumberList,
  getPhoneNumbers,
  loadTextIntegrationSettings,
  updateTextIntegrationSettings,
} from '../../../../../store/reducers/dealerOperations/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { RootState } from '../../../../../store/rootReducer';
import { states } from '../../helper';

const TextIntegration = () => {
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { textIntegrationSettings, availablePhoneNumberList } = useSelector(
    (state: RootState) => state.dealerOperations
  );

  useEffect(() => {
    if (selectedSC?.id) {
      dispatch(loadTextIntegrationSettings(selectedSC.id));
    }
  }, [selectedSC]);

  const { classes } = useStyles();
  const [isEditTable, setIsEditTable] = React.useState(false);
  const [legalName, setLegalName] = React.useState(''); // +
  const [dba, setDba] = React.useState(''); // +
  const [address, setAddress] = React.useState(''); // +
  const [city, setCity] = React.useState(''); // +
  const [contactEmail, setContactEmail] = React.useState(''); // +
  const [website, setWebsite] = React.useState(''); // +
  const [ein, setEin] = React.useState(''); // +
  const [state, setState] = React.useState(''); // +
  const [zip, setZip] = React.useState(''); /// +
  const [contactPhone, setContactPhone] = React.useState(''); // +
  const [accountSID, setAccountSID] = React.useState(''); // +
  const [authToken, setAuthToken] = React.useState(''); // +
  const [webhook, setWebhook] = React.useState(''); // +
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [shortlink, setShortlink] = React.useState('');

  // set data when visit tab
  // eslint-disable-next-line complexity
  useEffect(() => {
    if (textIntegrationSettings) {
      setLegalName(textIntegrationSettings.legalCompanyName || '');
      setWebsite(textIntegrationSettings.website || '');
      setDba(textIntegrationSettings.dba || '');
      setEin(textIntegrationSettings.ein || '');
      setAddress(textIntegrationSettings.addressStreet || '');
      setCity(textIntegrationSettings.city || '');
      setState(textIntegrationSettings.state || '');
      setZip(textIntegrationSettings.zip || '');
      setContactPhone(textIntegrationSettings.contactPhone || '');
      setContactEmail(textIntegrationSettings.contactEmail || '');
      setAccountSID(textIntegrationSettings.accountSid || '');
      setAuthToken(textIntegrationSettings.authToken || '');
      setWebhook(textIntegrationSettings.webhookSecret || '');
      setPhoneNumber(textIntegrationSettings.fromPhoneNumber || '');
      setShortlink(textIntegrationSettings.schedulingPageShortLink || '');
    }
  }, [textIntegrationSettings]);

  // clean number, if phone list in empthy
  useEffect(() => {
    if (!availablePhoneNumberList.length) {
      setPhoneNumber('');
    }
  }, [availablePhoneNumberList]);

  // eslint-disable-next-line complexity
  const handleCancelChanges = () => {
    if (textIntegrationSettings) {
      setLegalName(textIntegrationSettings?.legalCompanyName || '');
      setWebsite(textIntegrationSettings?.website || '');
      setDba(textIntegrationSettings?.dba || '');
      setEin(textIntegrationSettings?.ein || '');
      setAddress(textIntegrationSettings?.addressStreet || '');
      setCity(textIntegrationSettings?.city || '');
      setState(textIntegrationSettings?.state || '');
      setZip(textIntegrationSettings?.zip || '');
      setContactPhone(textIntegrationSettings?.contactPhone || '');
      setContactEmail(textIntegrationSettings?.contactEmail || '');
      setAccountSID(textIntegrationSettings?.accountSid || '');
      setAuthToken(textIntegrationSettings?.authToken || '');
      setWebhook(textIntegrationSettings?.webhookSecret || '');
      setPhoneNumber(textIntegrationSettings?.fromPhoneNumber || '');
      setShortlink(textIntegrationSettings?.schedulingPageShortLink || '');

      // return to prev phone or clean field when user press cancel
      if (textIntegrationSettings.authToken && textIntegrationSettings.accountSid) {
        dispatch(
          getPhoneNumbers(textIntegrationSettings.accountSid, textIntegrationSettings.authToken)
        );
      } else {
        dispatch(getAvailablePhoneNumberList([]));
      }
    } else {
      dispatch(getAvailablePhoneNumberList([]));
    }
  };

  const handleSave = () => {
    if (selectedSC?.id) {
      const data = {
        serviceCenterId: selectedSC.id,
        schedulingPageShortLink: shortlink,
        fromPhoneNumber: phoneNumber,
        webhookSecret: webhook,
        authToken: authToken,
        accountSid: accountSID,
        contactPhone: contactPhone,
        contactEmail: contactEmail,
        zip: zip,
        state: state,
        ein: ein,
        website: website,
        dba: dba,
        addressStreet: address,
        city: city,
        legalCompanyName: legalName,
      };

      dispatch(updateTextIntegrationSettings({ ...data }));
    }

    setIsEditTable(false);
  };

  // debounce
  useEffect(() => {
    if (!accountSID?.length || !authToken?.length) return;

    const timeout = setTimeout(() => {
      dispatch(getPhoneNumbers(accountSID, authToken));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [accountSID, authToken]);

  const handleCancel = () => {
    handleCancelChanges();
    setIsEditTable(false);
  };

  return (
    <>
      <div className={classes.editTableWrapper}>
        {isEditTable ? (
          <>
            <Button variant="text" onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button variant="text" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <Button variant="text" onClick={() => setIsEditTable(true)}>
            Edit
          </Button>
        )}
      </div>
      <div className={classes.container}>
        <div className={classes.inputsSection}>
          <p className={classes.titleRegistrations}>A2P registration inputs</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className={classes.formRegistrationWrapper}>
              <div className={classes.registrationForm}>
                <div>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    label="Legal company name"
                    placeholder="Legal Name"
                    onChange={e => setLegalName(e.target.value)}
                    value={legalName}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    label="DBA (If applicable)"
                    placeholder="DBA"
                    onChange={e => setDba(e.target.value)}
                    value={dba}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    label="Address/Street"
                    placeholder="Address"
                    onChange={e => setAddress(e.target.value)}
                    value={address}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    label="City"
                    placeholder="City"
                    onChange={e => setCity(e.target.value)}
                    value={city}
                  />
                </div>
                <div className={classes.extraMarginTop}>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    label="Contact Email *"
                    placeholder="Email"
                    onChange={e => setContactEmail(e.target.value)}
                    value={contactEmail}
                  />
                </div>
              </div>
              <div className={classes.settingsForm}>
                <div>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    label="Website *"
                    placeholder="URL"
                    onChange={e => setWebsite(e.target.value)}
                    value={website}
                  />
                </div>
                <div>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    label="Ein"
                    placeholder="XX-XXXXXXX"
                    onChange={e => setEin(e.target.value)}
                    value={ein}
                  />
                </div>
                <div>
                  <Autocomplete
                    className={classes.littleDropdowns}
                    disabled={!isEditTable}
                    value={state}
                    options={states}
                    isOptionEqualToValue={(o, v) => String(o) === String(v)}
                    getOptionLabel={o => o}
                    onChange={(e, selectedState) => setState(selectedState || '')}
                    renderInput={autocompleteRender({
                      label: 'State',
                      placeholder: 'State',
                    })}
                  />
                </div>
                <div>
                  <TextField
                    className={classes.littleDropdowns}
                    disabled={!isEditTable}
                    label="Zip"
                    placeholder="ZIP"
                    onChange={e => setZip(e.target.value)}
                    value={zip}
                  />
                </div>
                <div className={classes.extraMarginTop}>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    label="Contact Phone"
                    placeholder="1xxxxxxxxxx"
                    onChange={e => setContactPhone(e.target.value)}
                    value={contactPhone}
                  />
                </div>
              </div>
            </div>

            <p style={{ fontWeight: '400', fontSize: '18px', margin: 0 }}>
              * The registered campaign may be rejected if the email and website domain do not match
            </p>
          </div>
        </div>
        <hr className={classes.line} />
        <div className={classes.settingsWrapper}>
          <p className={classes.titleSettings}>Integration settings</p>

          <div className={classes.integrationFormWrapper}>
            <div>
              <TextField
                fullWidth
                disabled={!isEditTable}
                label="Account SID"
                placeholder="Account SID"
                onChange={e => setAccountSID(e.target.value)}
                value={accountSID}
              />
            </div>
            <div>
              <TextField
                fullWidth
                disabled={!isEditTable}
                label="Auth Token"
                placeholder="Auth token"
                onChange={e => setAuthToken(e.target.value)}
                value={authToken}
              />
            </div>
            <div>
              <TextField
                fullWidth
                disabled={!isEditTable}
                label="Webhook secret"
                placeholder="Webhook Secret"
                onChange={e => setWebhook(e.target.value)}
                value={webhook}
              />
            </div>
            <div>
              <Autocomplete
                fullWidth
                disabled={!isEditTable || !availablePhoneNumberList.length}
                value={phoneNumber}
                options={availablePhoneNumberList}
                isOptionEqualToValue={(o, v) => String(o) === String(v)}
                getOptionLabel={o => o}
                onChange={(e, selectedPhoneNumber) => setPhoneNumber(selectedPhoneNumber || '')}
                renderInput={autocompleteRender({
                  label: 'From Phone Numbers',
                  placeholder: 'Phone Number',
                })}
              />
            </div>
          </div>

          <hr className={classes.bottomLine} />

          <div className={classes.shortlinkWrapper}>
            <TextField
              fullWidth
              disabled={!isEditTable}
              label="Scheduling page shortlink"
              placeholder="URL"
              onChange={e => setShortlink(e.target.value)}
              value={shortlink}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TextIntegration;

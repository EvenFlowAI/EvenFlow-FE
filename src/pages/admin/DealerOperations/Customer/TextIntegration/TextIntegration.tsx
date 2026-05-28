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
import { useException } from '../../../../../hooks/useException/useException';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';

const TextIntegration = () => {
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { textIntegrationSettings, availablePhoneNumberList } = useSelector(
    (state: RootState) => state.dealerOperations
  );

  const { classes } = useStyles();
  const [isProcessingRequest, setIsProcessingRequest] = React.useState(false);
  const [isEditTable, setIsEditTable] = React.useState(false);
  const [legalName, setLegalName] = React.useState('');
  const [dba, setDba] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [ein, setEin] = React.useState('');
  const [state, setState] = React.useState('');
  const [zip, setZip] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [accountSID, setAccountSID] = React.useState('');
  const [authToken, setAuthToken] = React.useState('');
  const [webhook, setWebhook] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [shortlink, setShortlink] = React.useState('');
  const showError = useException();
  const [sidError, setSidError] = React.useState(false);
  const [authTokenError, setAuthTokenError] = React.useState(false);
  const [webhookError, setWebhookError] = React.useState(false);
  const [fromPhoneNumberError, setFromNumberError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const hideLoader = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedSC?.id) {
      setIsLoading(true);
      dispatch(loadTextIntegrationSettings(selectedSC.id, hideLoader));
    }
  }, [selectedSC]);

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

  // clean number, if a phone number list is empty
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
      if (
        textIntegrationSettings?.authToken?.length &&
        textIntegrationSettings?.accountSid?.length &&
        textIntegrationSettings?.webhookSecret?.length
      ) {
        dispatch(
          getPhoneNumbers(
            textIntegrationSettings?.accountSid,
            textIntegrationSettings.authToken,
            textIntegrationSettings.webhookSecret
          )
        );
      } else {
        dispatch(getAvailablePhoneNumberList([]));
      }
    } else {
      dispatch(getAvailablePhoneNumberList([]));

      setLegalName('');
      setWebsite('');
      setDba('');
      setEin('');
      setAddress('');
      setCity('');
      setState('');
      setZip('');
      setContactPhone('');
      setContactEmail('');
      setAccountSID('');
      setAuthToken('');
      setWebhook('');
      setPhoneNumber('');
      setShortlink('');
    }
  };

  /* eslint-disable complexity */
  const handleSave = () => {
    if (selectedSC?.id) {
      if (
        (!accountSID.length && !authToken.length && !webhook.length && !phoneNumber.length) ||
        (accountSID.length && authToken.length && webhook.length && phoneNumber.length)
      ) {
        if (website.length) {
          const urlPattern = /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[/#?]?.*$/i;

          if (!urlPattern.test(website)) {
            showError('Must be a valid absolute URL (http or https)');
            return;
          }
        }

        if (contactEmail.length) {
          const emailPattern =
            /^(?![.])[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)@[a-zA-Z0-9]+([-]?[a-zA-Z0-9]+)(\.[a-zA-Z]{2,})+$/;

          if (!emailPattern.test(contactEmail)) {
            showError('Please enter a valid Email format');
            return;
          }
        }

        if (zip.length) {
          if (zip.length !== 5) {
            showError('Invalid zip code');
            return;
          }
        }

        if (ein.length) {
          if (ein.length !== 10) {
            showError('EIN must be 9 digits or formatted as XX-XXXXXXX');
            return;
          }
        }

        if (contactPhone.length) {
          if (contactPhone.length < 10 || contactPhone.length > 11) {
            showError('Phone number is not valid. It should contain from 10 to 11 digits.');
            return;
          }
        }

        if (shortlink.length) {
          const urlPattern = /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[/#?]?.*$/i;

          if (!urlPattern.test(shortlink)) {
            showError('Must be a valid absolute URL (http or https)');
            return;
          }
        }

        if (legalName.length) {
          if (legalName.length < 2) {
            showError('Legal company name must be at least 2 characters');
            return;
          }
        }

        if (dba.length) {
          if (dba.length < 2) {
            showError('DBA must be at least 2 characters');
            return;
          }
        }

        if (address.length) {
          if (address.length < 2) {
            showError('Address/Street must be at least 2 characters');
            return;
          }
        }

        if (city.length) {
          if (city.length < 2) {
            showError('City must be at least 2 characters');
            return;
          }
        }

        setSidError(false);
        setAuthTokenError(false);
        setWebhookError(false);
        setFromNumberError(false);

        const data = {
          serviceCenterId: selectedSC.id,
          schedulingPageShortLink: shortlink || null,
          fromPhoneNumber: phoneNumber || null,
          webhookSecret: webhook || null,
          authToken: authToken || null,
          accountSid: accountSID || null,
          contactPhone: contactPhone.trim() || null,
          contactEmail: contactEmail.trim() || null,
          zip: zip || null,
          state: state.trim() || null,
          ein: ein.trim() || null,
          website: website.trim() || null,
          dba: dba.trim() || null,
          addressStreet: address.trim() || null,
          city: city.trim() || null,
          legalCompanyName: legalName.trim() || null,
        };

        setIsLoading(true);

        if (!phoneNumber.length) {
          dispatch(updateTextIntegrationSettings({ ...data }, true, hideLoader));
        } else {
          dispatch(updateTextIntegrationSettings({ ...data }, false, hideLoader));
        }

        setIsEditTable(false);
      } else {
        if (!accountSID.length || !authToken.length || !webhook.length || !phoneNumber.length) {
          if (!accountSID.length) {
            showError('Account SID is required.');
            setSidError(true);
          }
          if (!authToken.length) {
            showError('Auth token is required.');
            setAuthTokenError(true);
          }
          if (!webhook.length) {
            showError('Webhook secret is required.');
            setWebhookError(true);
          }
          if (!phoneNumber.length) {
            showError('From phone number is required.');
            setFromNumberError(true);
          }
          return;
        }
      }
    }
  };

  const handleNoFoundNumberList = () => {
    showError('The provided TextGrid credentials are invalid');
  };

  const updateIsProcessingRequest = (value: boolean) => {
    setIsProcessingRequest(value);
  };

  // debounce
  useEffect(() => {
    if (!accountSID?.length || !authToken?.length || !webhook?.length) {
      updateIsProcessingRequest(false);
      dispatch(getAvailablePhoneNumberList([]));
      return;
    }

    const timeout = setTimeout(() => {
      dispatch(
        getPhoneNumbers(
          accountSID,
          authToken,
          webhook,
          handleNoFoundNumberList,
          updateIsProcessingRequest
        )
      );
    }, 1000);

    return () => clearTimeout(timeout);
  }, [accountSID, authToken, webhook]);

  const handleCancel = () => {
    handleCancelChanges();

    setWebhookError(false);
    setSidError(false);
    setFromNumberError(false);
    setAuthTokenError(false);

    setIsEditTable(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={classes.editTableWrapper}>
        {isEditTable ? (
          <>
            <Button variant="text" onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button variant="text" disabled={isProcessingRequest} onClick={handleSave}>
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

          <div className={classes.formRegistrationContainer}>
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
                    label="EIN"
                    placeholder="XX-XXXXXXX"
                    value={ein}
                    onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 9) val = val.slice(0, 9);

                      let formatted = val;
                      if (val.length > 2) {
                        formatted = val.slice(0, 2) + '-' + val.slice(2);
                      }

                      setEin(formatted);
                    }}
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
                    value={zip}
                    onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');

                      if (val.length > 5) val = val.slice(0, 5);
                      setZip(val);
                    }}
                    inputProps={{ maxLength: 5 }}
                  />
                </div>
                <div className={classes.extraMarginTop}>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    label="Contact Phone"
                    placeholder="1xxxxxxxxxx"
                    value={contactPhone}
                    onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 11) val = val.slice(0, 11);
                      setContactPhone(val);
                    }}
                    inputProps={{ maxLength: 11 }}
                  />
                </div>
              </div>
            </div>

            <p className={classes.bottomText}>
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
                onChange={e => {
                  setSidError(false);
                  setIsProcessingRequest(true);
                  setAccountSID(e.target.value);
                }}
                error={sidError}
                value={accountSID}
              />
            </div>
            <div>
              <TextField
                fullWidth
                disabled={!isEditTable}
                label="Auth Token"
                placeholder="Auth token"
                error={authTokenError}
                onChange={e => {
                  setAuthTokenError(false);
                  setIsProcessingRequest(true);
                  setAuthToken(e.target.value);
                }}
                value={authToken}
              />
            </div>
            <div>
              <TextField
                fullWidth
                disabled={!isEditTable}
                label="Webhook secret"
                placeholder="Webhook Secret"
                error={webhookError}
                onChange={e => {
                  setWebhookError(false);
                  setIsProcessingRequest(true);
                  setWebhook(e.target.value);
                }}
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
                onChange={(e, selectedPhoneNumber) => {
                  setFromNumberError(false);
                  setPhoneNumber(selectedPhoneNumber || '');
                }}
                renderInput={autocompleteRender({
                  label: 'From Phone Numbers',
                  placeholder: 'Phone Number',
                  error: fromPhoneNumberError,
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

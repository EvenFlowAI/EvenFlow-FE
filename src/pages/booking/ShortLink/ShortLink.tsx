import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { WelcomeLayout } from '../../../features/booking/WelcomeLayout/WelcomeLayout';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import { authService } from '../../../api/AuthService/AuthService';
import { endUserTheme } from '../../../theme/theme';
import { ContentContainer, Info } from './styles';

type TState = 'loading' | 'error';

/**
 * The backend mirrors this pattern - codes are generated from a mixed-case alphabet and are
 * compared case sensitively, so the code must reach the API exactly as it appears in the URL.
 */
const SHORT_CODE_PATTERN = /^[A-Za-z0-9]{4,16}$/;

type TResolvedShortUrl = {
  targetUrl?: string;
  data?: { targetUrl?: string } | null;
};

export const ShortLink = () => {
  const [state, setState] = useState<TState>('loading');
  const { code } = useParams<{ code: string }>();
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;
    setState('loading');

    if (!code || !SHORT_CODE_PATTERN.test(code)) {
      setState('error');
      return;
    }

    const resolve = async () => {
      try {
        await authService.ensureAnonymousToken();

        const { data } = await Api.call<TResolvedShortUrl>(Api.endpoints.ShortUrls.Resolve, {
          urlParams: { code },
        });
        const targetUrl = data?.data?.targetUrl ?? data?.targetUrl;

        if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
          if (isActive) setState('error');
          return;
        }

        // targetUrl carries percent encoded ciphertext (?source=aBc%2Bdef). It must be handed to
        // the browser untouched - decoding or re-building it through URL/URLSearchParams corrupts
        // the payload. replace() rather than assign() keeps the resolver out of the back stack.
        window.location.replace(targetUrl);
      } catch (e) {
        console.error('Short link resolve error: ', e);
        if (isActive) setState('error');
      }
    };

    resolve();

    return () => {
      isActive = false;
    };
  }, [code]);

  const getContent = () => {
    if (state === 'error') {
      return (
        <div>
          <p>{t('This link is no longer valid')}.</p>
          <Info>{t('Please check your link or contact service center directly')}.</Info>
        </div>
      );
    }

    return <Loading />;
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={endUserTheme}>
        <WelcomeLayout title={''}>
          <ContentContainer>{getContent()}</ContentContainer>
        </WelcomeLayout>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ShortLink;

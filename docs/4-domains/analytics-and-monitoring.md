# Analytics and Monitoring Domain

## Implementation Summary

Analytics and monitoring are implemented with GA4, GTM, AWS RUM, and Sentry packages wired through app startup and custom hooks.

## Concrete Patterns

- Per-site tracker initialization logic is in `src/hooks/useAnalyticsBySCId/useAnalyticsBySCId.tsx`.
- GTM is initialized conditionally when tracker metadata provides `gmtId`.
- AWS RUM client setup is done in `src/App.tsx` for production.

## Code Examples

From `src/hooks/useAnalyticsBySCId/useAnalyticsBySCId.tsx`:

```tsx
const trackersData: TReactGATracker[] = TRACKERS.map(el => ({
  trackingId: el.measurementId,
  gaOptions: {
    ...options,
    name: el.measurementId,
  },
}));

ReactGA.initialize(trackersData);
```

```tsx
TRACKERS.forEach(item => {
  if (item.gmtId) {
    TagManager.initialize({
      gtmId: item.gmtId,
    });
  }
});
```

From `src/App.tsx`:

```tsx
if (process.env.REACT_APP_ENV === 'production') {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    telemetries: ['performance', 'errors'],
    allowCookies: false,
    enableXRay: false,
  };

  new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config);
}
```


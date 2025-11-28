import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles<{ isEditMode: boolean; choosenColor?: string }>()(
  (theme, { isEditMode, choosenColor }) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
    },
    titleText: {
      fontWeight: 'bold',
    },
    headerRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 0,
      borderRadius: 0,
      boxShadow: 'none',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '600px 320px',
      gap: theme.spacing(3),
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      background: theme.palette.background.paper,
      padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} 16px`,
    },
    logoWrapper: {
      width: 180,
      height: 88,
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: choosenColor ? `#${choosenColor}` : '#DADADA',
      overflow: 'hidden',
      position: 'relative',
      cursor: isEditMode ? 'pointer' : 'default',
    },
    logoPlaceholderWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    logoPlaceholderText: {
      color: '#5E5F66',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textAlign: 'center',
      lineHeight: 1.2,
    },
    logoImg: {
      width: '100%',
      height: '100%',
      maxWidth: 120, // keep within square wrapper width
      maxHeight: 80, // enforce rectangular display so layout stays consistent
      objectFit: 'contain',
    },
    previewColorBox: {
      width: 65,
      height: 65,
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      cursor: isEditMode ? 'pointer' : 'default',
    },
    row: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 15,
      flexWrap: 'wrap',
    },
    actionsRow: {
      display: 'flex',
      gap: theme.spacing(2),
      flexWrap: 'wrap',
    },
    resetButtonBase: {
      alignSelf: 'stretch',
      justifyContent: 'flex-start',
      paddingLeft: 0,
    },
    resetButtonGrey: {
      color: '#858585',
      '&:hover': {
        color: '#858585',
        backgroundColor: 'transparent',
      },
    },
    resetButtonPrimary: {
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: 'transparent',
      },
    },
    uploadLogoWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minWidth: 200,
      maxWidth: 260,
    },
    hexColorSectionWrapper: { display: 'flex', alignItems: 'flex-start', gap: 15 },
    leftColorColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 8,
      width: 65,
    },
    colorInputsContainer: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200 },
    colorResetContainer: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 },
    helperTextWrap: {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    },
    pickerWrap: {
      marginTop: 8,
      alignSelf: 'flex-start',
      marginLeft: 0,
    },
  })
);

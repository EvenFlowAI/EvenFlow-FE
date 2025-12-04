import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles<{ isEditMode: boolean; chosenColor?: string }>()(
  (theme, { isEditMode, chosenColor }) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(3),
    },
    titleText: {
      fontWeight: 'bold',
    },
    helperTextWrapper: {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
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
      gridTemplateColumns: '65% 35%',
      gap: theme.spacing(3),
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      background: theme.palette.background.paper,
      padding: `${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(2)}`,
    },
    logoWrapper: {
      width: '35%',
      minWidth: '7rem',
      minHeight: '7rem',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      background: chosenColor ? `#${chosenColor}` : '#DADADA',
      cursor: isEditMode ? 'pointer' : 'default',
      [theme.breakpoints.down('sm')]: {
        width: '45%',
      },
      [theme.breakpoints.up('lg')]: {
        width: '28%',
      },
    },
    logoImg: {
      width: '100%',
      height: '100%',
      maxHeight: '20rem',
      objectFit: 'contain',
      display: 'block',
    },
    previewColorBox: {
      width: theme.spacing(8), // ~64px
      height: theme.spacing(8),
      flexShrink: 0,
      alignSelf: 'flex-end',
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`,
      cursor: isEditMode ? 'pointer' : 'default',
      [theme.breakpoints.down('xs')]: {
        width: theme.spacing(5), // ~40px
        height: theme.spacing(5),
      },
      [theme.breakpoints.down('sm')]: {
        width: theme.spacing(7), // ~60px
        height: theme.spacing(7),
      },
      [theme.breakpoints.up('lg')]: {
        width: theme.spacing(8.75), // ~70px
        height: theme.spacing(8.75),
      },
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
      minWidth: '20%',
      maxWidth: '26%',
    },
    fileInputWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    hexColorSectionWrapper: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: theme.spacing(2),
      flexWrap: 'nowrap',
    },
    leftColorColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(1),
    },
    previewWrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    colorInputsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
      flex: 1,
      minWidth: '25%',
      justifyContent: 'flex-end',
    },
    colorResetContainer: { display: 'flex', flexDirection: 'column', gap: '2%', marginTop: '2%' },
    pickerPopover: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: 0,
      zIndex: theme.zIndex.modal,
      background: theme.palette.background.paper,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4],
      border: `1px solid ${theme.palette.divider}`,
      // hide default color preview block
      '& .rc-color-picker-color-block': {
        display: 'none',
      },
    },
  })
);

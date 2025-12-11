import { makeStyles } from 'tss-react/mui';
import { sideBarWidth } from '../../../theme/theme';
import { DEFAULT_SIDEBAR_HEX } from '../../../utils/constants';

export const useStyles = makeStyles<{ sidebarColor?: string }>()((theme, params) => ({
  drawer: {
    flexShrink: 0,
    width: sideBarWidth,
    display: 'flex',
    flexFlow: 'column',
    position: 'relative',
  },
  link: {
    color: '#fff',
    marginTop: 16,
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    maxWidth: '10rem',
    maxHeight: '10rem',
    marginBottom: 60,
    cursor: 'pointer',
    objectFit: 'contain',
    transition: theme.transitions.create(['opacity']),
    '&:hover': {
      opacity: 0.8,
    },
  },
  drawerPaper: {
    width: sideBarWidth,
    backgroundColor: params.sidebarColor ? `#${params.sidebarColor}` : `#${DEFAULT_SIDEBAR_HEX}`,
    color: '#FFFFFF',
    display: 'flex',
    flexFlow: 'column',
    padding: '60px 30px',
    alignItems: 'center',
    justifyContent: 'space-between',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    '& .MuiList-root': {
      paddingLeft: 0,
    },
  },
}));

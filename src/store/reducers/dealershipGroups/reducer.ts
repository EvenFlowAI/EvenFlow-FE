import { DealershipActions, DealershipState } from './types';
import { defaultPageData, defaultPaging } from '../constants';

const initialState: DealershipState = {
  dealershipList: [],
  loading: false,
  saving: false,
  paging: { ...defaultPaging },
  pageData: { ...defaultPageData },
  searchTerm: '',
  sidebarColorHex: undefined,
  customLogoPath: undefined,
  isDefaultLogo: false,
};

export const dealershipGroupsReducer = (
  state = initialState,
  action: DealershipActions
): DealershipState => {
  switch (action.type) {
    case 'Dealership/Add':
      return { ...state, dealershipList: [action.payload, ...state.dealershipList] };
    case 'Dealership/Profile':
      return {
        ...state,
        profile: action.payload,
        sidebarColorHex: action.payload.leftPanelColor,
        customLogoPath: action.payload.logoPath,
      };
    case 'Dealership/Remove':
      return {
        ...state,
        dealershipList: state.dealershipList.filter(d => d.id !== action.payload),
      };
    case 'Dealership/GetAll':
      return { ...state, dealershipList: action.payload };
    case 'Dealership/Loading':
      return { ...state, loading: action.payload };
    case 'Dealership/Saving':
      return { ...state, saving: action.payload };
    case 'Dealership/ChangePageData':
      return { ...state, pageData: { ...state.pageData, ...action.payload } };
    case 'Dealership/ChangePaging':
      return { ...state, paging: action.payload };
    case 'Dealership/SetSearchTerm':
      return { ...state, searchTerm: action.payload };
    case 'Dealership/SetSidebarColorHex':
      return { ...state, sidebarColorHex: action.payload };
    case 'Dealership/SetCustomLogoPath':
      return {
        ...state,
        customLogoPath: action.payload.value,
        isDefaultLogo: action.payload.isDefault,
      };
    default:
      return state;
  }
};

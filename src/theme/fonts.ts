import ProximaNovaRegular from '../assets/fonts/ProximaNova-Regular.otf';
import ProximaNovaThin from '../assets/fonts/Proxima Nova Thin.otf';
import ProximaNovaExtraBold from '../assets/fonts/Proxima Nova Extrabold.otf';
import ProximaNovaBold from '../assets/fonts/Proxima Nova Bold.otf';
// import ProximaNovaBlack from './fonts/Proxima Nova Black.otf';
// import ProximaNovaAltThin from './fonts/Proxima Nova Alt Thin.otf';
// import ProximaNovaAltLight from './fonts/Proxima Nova Alt Light.otf';
// import ProximaNovaAltBold from './fonts/Proxima Nova Alt Bold.otf';

const proximaNovaRegular = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 400,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-Regular'),
        url('${ProximaNovaRegular}') format('opentype')
    `
};
const proximaNovaBold = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 700,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-Bold'),
        url('${ProximaNovaBold}') format('opentype')
    `
};

const proximaNovaThin = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 100,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-Thin'),
        url('${ProximaNovaThin}') format('opentype')
    `
};
const proximaNovaExtraBold = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 900,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-ExtraBold'),
        url('${ProximaNovaExtraBold}') format('opentype')
    `
};
export const fonts = [
    proximaNovaRegular,
    proximaNovaBold,
    proximaNovaThin,
    proximaNovaExtraBold
];
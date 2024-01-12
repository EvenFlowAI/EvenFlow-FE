import ProximaNovaRegular from '../assets/fonts/ProximaNova-Regular.woff';
import ProximaNovaThin from '../assets/fonts/ProximaNovaT-Thin.woff';
import ProximaNovaExtraBold from '../assets/fonts/ProximaNova-Extrabld.woff';
import ProximaNovaBold from '../assets/fonts/ProximaNova-Bold.woff';

const proximaNovaRegular = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 400,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-Regular'),
        url('${ProximaNovaRegular}') format('woff')
    `
};

const proximaNovaBold = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 700,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-Bold'),
        url('${ProximaNovaBold}') format('woff')
    `
};

const proximaNovaThin = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 100,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-Thin'),
        url('${ProximaNovaThin}') format('woff')
    `
};
const proximaNovaExtraBold = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 900,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-ExtraBold'),
        url('${ProximaNovaExtraBold}') format('woff')
    `
};

export const fonts = [
    proximaNovaRegular,
    proximaNovaBold,
    proximaNovaThin,
    proximaNovaExtraBold
];
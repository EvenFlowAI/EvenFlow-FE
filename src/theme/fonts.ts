import ProximaNovaRegularWoff from '../assets/fonts/ProximaNova-Regular.woff';
import ProximaNovaRegularWoff2 from '../assets/fonts/ProximaNova-Regular.woff2';
import ProximaNovaRegularTtf from '../assets/fonts/ProximaNova-Regular.ttf';
import ProximaNovaRegularOtf from '../assets/fonts/ProximaNova-Regular.otf';
import ProximaNovaRegularEot from '../assets/fonts/ProximaNova-Regular.eot';
import ProximaNovaThinWoff from '../assets/fonts/ProximaNovaT-Thin.woff';
import ProximaNovaThinWoff2 from '../assets/fonts/ProximaNovaT-Thin.woff2';
import ProximaNovaThinTtf from '../assets/fonts/ProximaNovaT-Thin.ttf';
import ProximaNovaThinEot from '../assets/fonts/ProximaNovaT-Thin.eot';
import ProximaNovaThinOtf from '../assets/fonts/Proxima Nova Thin.otf';
import ProximaNovaExtraBoldWoff from '../assets/fonts/ProximaNova-Extrabld.woff';
import ProximaNovaExtraBoldWoff2 from '../assets/fonts/ProximaNova-Extrabld.woff2';
import ProximaNovaExtraBoldTtf from '../assets/fonts/ProximaNova-Extrabld.ttf';
import ProximaNovaExtraBoldEot from '../assets/fonts/ProximaNova-Extrabld.eot';
import ProximaNovaExtraBoldOtf from '../assets/fonts/Proxima Nova Extrabold.otf';
import ProximaNovaBoldWoff from '../assets/fonts/ProximaNova-Bold.woff';
import ProximaNovaBoldWoff2 from '../assets/fonts/ProximaNova-Bold.woff2';
import ProximaNovaBoldTtf from '../assets/fonts/ProximaNova-Bold.ttf';
import ProximaNovaBoldEot from '../assets/fonts/ProximaNova-Bold.eot';
import ProximaNovaBoldOtf from '../assets/fonts/Proxima Nova Bold.otf';

export const proximaNovaRegular = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 400,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-Regular'),
        url('${ProximaNovaRegularWoff}') format('opentype'),
        url('${ProximaNovaRegularWoff2}') format('opentype'),
        url('${ProximaNovaRegularTtf}') format('opentype'),
        url('${ProximaNovaRegularOtf}') format('opentype'),
        url('${ProximaNovaRegularEot}') format('opentype'),
    `
};

export const proximaNovaBold = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 700,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-Bold'),
        url('${ProximaNovaThinWoff}') format('opentype'),
        url('${ProximaNovaThinWoff2}') format('opentype'),
        url('${ProximaNovaThinTtf}') format('opentype'),
        url('${ProximaNovaThinEot}') format('opentype'),
        url('${ProximaNovaThinOtf}') format('opentype'),
    `
};

export const proximaNovaThin = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 100,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-Thin'),
        url('${ProximaNovaBoldWoff}') format('opentype'),
        url('${ProximaNovaBoldWoff2}') format('opentype'),
        url('${ProximaNovaBoldTtf}') format('opentype'),
        url('${ProximaNovaBoldEot}') format('opentype'),
        url('${ProximaNovaBoldOtf}') format('opentype'),
    `
};
export const proximaNovaExtraBold = {
    fontFamily: 'Proxima Nova',
    fontStyle: 'normal',
    fontWeight: 900,
    src: `
        local('Proxima Nova'),
        local('ProximaNova-ExtraBold'),
        url('${ProximaNovaExtraBoldWoff}') format('opentype'),
        url('${ProximaNovaExtraBoldWoff2}') format('opentype'),
        url('${ProximaNovaExtraBoldTtf}') format('opentype'),
        url('${ProximaNovaExtraBoldOtf}') format('opentype'),
        url('${ProximaNovaExtraBoldEot}') format('opentype'),
    `
};

export const fonts = [
    proximaNovaExtraBold,
    proximaNovaBold,
    proximaNovaRegular,
    proximaNovaThin
];
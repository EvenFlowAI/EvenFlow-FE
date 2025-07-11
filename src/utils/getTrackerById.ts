import { ServiceCenters } from './getTrackersForParentSite';
import { decodeSCID } from './utils';
import { parentOrigins } from './constants';

const productionTrackerMap: Record<string, string> = {
  [ServiceCenters.TestBmwOfSchererville]: 'UA-210743216-6',
  [ServiceCenters.HennessysRiverViewFordQuickLane]: 'G-NBXVY09B7S',
  [ServiceCenters.HennessysRiverViewFordMainServiceDrive]: 'G-NBXVY09B7S',
  [ServiceCenters.FremontCDJRCasper]: 'G-FBF51NY0TY',
  [ServiceCenters.FremontCDJRRockSprings]: 'G-9DVYXDJ45M',
  [ServiceCenters.JanssenCDJRofNorthPlatte]: 'G-7177QY7LH2',
  [ServiceCenters.JanssenSonsFord]: 'G-YXMH70Q2JX',
  [ServiceCenters.LakePowellFord]: 'G-HS4HDY3376',
  [ServiceCenters.MorrisSmithFordOfLarned]: 'G-4BFDSPFKH6',
  [ServiceCenters.PerformanceKingsHondaCincinnati]: 'G-P3DH15MW8P',
  [ServiceCenters.PerformanceHondaFairfield]: 'G-JFFE7XLTF5',
  [ServiceCenters.PerformanceLexusRiverCenter]: 'G-3074D59PM3',
  [ServiceCenters.PerformanceLexusCincinnati]: 'G-5XJ8256YEZ',
  [ServiceCenters.PerformanceCDJRCenterville]: 'G-EEJPTXTVF2',
  [ServiceCenters.PerformanceToyotaFairfield]: 'G-HXLXXZQ4YB',
  [ServiceCenters.FremontMotorRiverton]: 'G-YT0WTD548Z',
  [ServiceCenters.FremontMotorCody]: 'G-JZ5SG376SH',
  [ServiceCenters.FremontMotorPowell]: 'G-4853N7VZ21',
  [ServiceCenters.FremontLanderFord]: 'G-VSQ7H51M2D',
  [ServiceCenters.FremontLanderCDJR]: 'G-5BV7X721KQ',
  [ServiceCenters.BeloitAutoAndTruck]: 'G-0YK1QM06NR',
  [ServiceCenters.PerformanceHondaBountiful]: 'G-5JYPV2SJRT',
  [ServiceCenters.PerformanceFordLincolnBountiful]: 'G-TT0L0LN92Z',
  [ServiceCenters.PerformanceFordTruckCountry]: 'G-S3Y40YJ5T1',
  [ServiceCenters.PerformanceToyotaBountiful]: 'G-YEYXB53XXG',
  [ServiceCenters.Dominion]: 'G-N0HF9JRRD5',
  [ServiceCenters.DealerBuilt]: 'G-NWSJ2GDBV1',
  [ServiceCenters.DealertrackTeamHondaMerrillville]: 'G-7LJXRM8J7P',
  [ServiceCenters.DealertrackTomWoodVolkswagenIndianapolis]: 'G-M6RLKFX5GG',
  [ServiceCenters.DealertrackTomWoodVolkswagenNoblesville]: 'G-7TTKL8BB54',
  [ServiceCenters.DealertrackTomWoodToyota]: 'G-2PH56MCDS2',
  [ServiceCenters.DealertrackCovinaKia]: 'G-PQGQVFH16R',
  [ServiceCenters.TekionWalserBuickGMCofBloomington]: 'G-BMDLQ8PS7X',
  [ServiceCenters.Subaru]: 'G-N620TERHNN',
  [ServiceCenters.DealerTrackHonda]: 'G-26B8EPXVKX',
  [ServiceCenters.WalserMitsubishi]: 'G-EDDHXKDHQW',
  [ServiceCenters.FremontToyotaLander]: 'G-0H94Y61KEX',
  [ServiceCenters.FremontToyotaSheridan]: 'G-45JZX8MWV8',
  [ServiceCenters.FremontCDJRRawlins]: 'G-ZS6J1SKGXV',
  [ServiceCenters.PerformanceKingHonda]: 'G-VDWW9J4VCF',
  [ServiceCenters.BurnsHonda]: 'G-P3GKP7QE4Y',
  [ServiceCenters.WalserToyota]: 'G-6X6C6FF8BC',
  [ServiceCenters.WolfchaseHyundaiDealertrack]: 'G-ELP8LE5GW8',
};

export const getTrackerById = (id: string): string => {
  const decodedId = decodeSCID(id);
  const env = process.env.REACT_APP_ENV;

  if (env === 'uat') return 'G-ZW2CJN5R98';

  if (env === 'production') {
    if (decodedId in productionTrackerMap) {
      return productionTrackerMap[decodedId];
    }

    if (origin.includes(parentOrigins.scherervilleEvenflow)) {
      return 'UA-210743216-8';
    }

    return 'G-DWX0X9CBTT';
  }

  return 'G-LS5EEY1SRM';
};

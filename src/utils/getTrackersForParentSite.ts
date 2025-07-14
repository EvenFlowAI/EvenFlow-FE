import { GATrackers } from './types';
import { decodeSCID } from './utils';

export const ServiceCenters = {
  HennessysRiverViewFordQuickLane: 2,
  HennessysRiverViewFordMainServiceDrive: 6,
  FremontCDJRCasper: 7,
  FremontCDJRRockSprings: 8,
  JanssenCDJRofNorthPlatte: 9,
  JanssenSonsFord: 10,
  MorrisSmithFordOfLarned: 13,
  PerformanceKingsHondaCincinnati: 14,
  PerformanceHondaFairfield: 15,
  PerformanceLexusCincinnati: 16,
  PerformanceLexusRiverCenter: 17,
  PerformanceCDJRCenterville: 18,
  PerformanceToyotaFairfield: 19,
  LeeJanssenMotorCompanyChevrolet: 20,
  LakePowellFord: 35,
  TestBmwOfSchererville: 123,
  FremontMotorRiverton: 22,
  FremontMotorCody: 23,
  FremontMotorPowell: 24,
  FremontLanderFord: 26,
  FremontLanderCDJR: 27,
  BeloitAutoAndTruck: 30,
  PerformanceHondaBountiful: 163,
  PerformanceFordLincolnBountiful: 164,
  PerformanceFordTruckCountry: 165,
  PerformanceToyotaBountiful: 166,
  Dominion: 130,
  DealerBuilt: 328,
  DealertrackTeamHondaMerrillville: 430,
  DealertrackTomWoodVolkswagenIndianapolis: 427,
  DealertrackTomWoodVolkswagenNoblesville: 428,
  DealertrackTomWoodToyota: 429,
  DealertrackCovinaKia: 460,
  TekionWalserBuickGMCofBloomington: 461,
  Subaru: 559,
  DealerTrackHonda: 658,
  WalserMitsubishi: 691,
  FremontCDJRRawlins: 724,
  FremontToyotaLander: 725,
  FremontToyotaSheridan: 726,
  PerformanceKingHonda: 592,
  BurnsHonda: 823,
  WalserToyota: 790,
  WolfchaseHyundaiDealertrack: 824,
};

const parentTrackersMap: Record<number, GATrackers[]> = {
  [ServiceCenters.FremontCDJRCasper]: [
    { measurementId: 'G-34E3JLKYGN', gmtId: 'GTM-TNB7FJ' },
    { measurementId: 'G-FBF51NY0TY' },
  ],
  [ServiceCenters.FremontMotorCody]: [
    { measurementId: 'G-H8QNCXRRVW', gmtId: 'GTM-PHGS6B' },
    { measurementId: 'G-DP0EC3VXQL', gmtId: 'GTM-MG6DT7' },
    { measurementId: 'G-JZ5SG376SH' },
  ],
  [ServiceCenters.FremontLanderCDJR]: [
    { measurementId: 'G-88673LPKRB', gmtId: 'GTM-MRXSH3' },
    { measurementId: 'G-5BV7X721KQ' },
  ],
  [ServiceCenters.FremontCDJRRockSprings]: [
    { measurementId: 'G-NV5842RXF3', gmtId: 'GTM-P7RTQC' },
    { measurementId: 'G-9DVYXDJ45M' },
  ],
  [ServiceCenters.FremontMotorRiverton]: [
    { measurementId: 'G-92EJQHZMGQ', gmtId: 'GTM-W3DJPG' },
    { measurementId: 'G-YT0WTD548Z' },
  ],
  [ServiceCenters.FremontMotorPowell]: [
    { measurementId: 'G-QTPHWHLZC6', gmtId: 'GTM-PBT4Q7' },
    { measurementId: 'G-4853N7VZ21' },
  ],
  [ServiceCenters.HennessysRiverViewFordQuickLane]: [{ measurementId: 'G-NBXVY09B7S' }],
  [ServiceCenters.HennessysRiverViewFordMainServiceDrive]: [{ measurementId: 'G-NBXVY09B7S' }],
  [ServiceCenters.JanssenCDJRofNorthPlatte]: [{ measurementId: 'G-7177QY7LH2' }],
  [ServiceCenters.JanssenSonsFord]: [{ measurementId: 'G-YXMH70Q2JX' }],
  [ServiceCenters.LakePowellFord]: [{ measurementId: 'G-HS4HDY3376' }],
  [ServiceCenters.MorrisSmithFordOfLarned]: [{ measurementId: 'G-4BFDSPFKH6' }],
  [ServiceCenters.PerformanceKingsHondaCincinnati]: [{ measurementId: 'G-P3DH15MW8P' }],
  [ServiceCenters.PerformanceHondaFairfield]: [{ measurementId: 'G-JFFE7XLTF5' }],
  [ServiceCenters.PerformanceLexusRiverCenter]: [{ measurementId: 'G-3074D59PM3' }],
  [ServiceCenters.PerformanceLexusCincinnati]: [{ measurementId: 'G-5XJ8256YEZ' }],
  [ServiceCenters.PerformanceCDJRCenterville]: [{ measurementId: 'G-EEJPTXTVF2' }],
  [ServiceCenters.PerformanceToyotaFairfield]: [{ measurementId: 'G-HXLXXZQ4YB' }],
  [ServiceCenters.BeloitAutoAndTruck]: [{ measurementId: 'G-0YK1QM06NR' }],
  [ServiceCenters.PerformanceHondaBountiful]: [{ measurementId: 'G-5JYPV2SJRT' }],
  [ServiceCenters.PerformanceFordLincolnBountiful]: [{ measurementId: 'G-TT0L0LN92Z' }],
  [ServiceCenters.PerformanceFordTruckCountry]: [{ measurementId: 'G-S3Y40YJ5T1' }],
  [ServiceCenters.PerformanceToyotaBountiful]: [{ measurementId: 'G-YEYXB53XXG' }],
  [ServiceCenters.FremontLanderFord]: [{ measurementId: 'G-VSQ7H51M2D' }],
  [ServiceCenters.Dominion]: [{ measurementId: 'G-N0HF9JRRD5' }],
  [ServiceCenters.DealerBuilt]: [{ measurementId: 'G-NWSJ2GDBV1' }],
  [ServiceCenters.DealertrackTeamHondaMerrillville]: [{ measurementId: 'G-7LJXRM8J7P' }],
  [ServiceCenters.DealertrackTomWoodVolkswagenIndianapolis]: [{ measurementId: 'G-M6RLKFX5GG' }],
  [ServiceCenters.DealertrackTomWoodVolkswagenNoblesville]: [{ measurementId: 'G-7TTKL8BB54' }],
  [ServiceCenters.DealertrackTomWoodToyota]: [{ measurementId: 'G-2PH56MCDS2' }],
  [ServiceCenters.DealertrackCovinaKia]: [{ measurementId: 'G-PQGQVFH16R' }],
  [ServiceCenters.TekionWalserBuickGMCofBloomington]: [{ measurementId: 'G-BMDLQ8PS7X' }],
  [ServiceCenters.Subaru]: [{ measurementId: 'G-N620TERHNN' }],
  [ServiceCenters.DealerTrackHonda]: [{ measurementId: 'G-26B8EPXVKX' }],
  [ServiceCenters.WalserMitsubishi]: [{ measurementId: 'G-EDDHXKDHQW' }],
  [ServiceCenters.FremontToyotaLander]: [{ measurementId: 'G-0H94Y61KEX' }],
  [ServiceCenters.FremontToyotaSheridan]: [{ measurementId: 'G-45JZX8MWV8' }],
  [ServiceCenters.FremontCDJRRawlins]: [{ measurementId: 'G-ZS6J1SKGXV' }],
  [ServiceCenters.PerformanceKingHonda]: [{ measurementId: 'G-VDWW9J4VCF' }],
  [ServiceCenters.BurnsHonda]: [{ measurementId: 'G-P3GKP7QE4Y' }],
  [ServiceCenters.WalserToyota]: [{ measurementId: 'G-6X6C6FF8BC' }],
  [ServiceCenters.WolfchaseHyundaiDealertrack]: [{ measurementId: 'G-ELP8LE5GW8' }],
};

export const getTrackersForParentSite = (id: string): GATrackers[] => {
  const decodedId = decodeSCID(id);
  const env = process.env.REACT_APP_ENV;

  if (env === 'uat') {
    return [{ measurementId: 'G-ZW2CJN5R98' }];
  }

  if (env === 'production') {
    return parentTrackersMap[decodedId] ?? [{ measurementId: 'G-DWX0X9CBTT' }];
  }

  return [{ measurementId: 'G-LS5EEY1SRM' }];
};

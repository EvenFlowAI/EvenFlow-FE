import { EServiceType } from '../../store/reducers/appointmentFrameReducer/types';
import { TServiceTypeSettings } from '../../store/reducers/bookingFlowConfig/types';
import { IFirstScreenOption } from '../../store/reducers/serviceTypes/types';
import { getCurrentMenu, getStepsMap, getStepsScreen } from '../../features/booking/utils/utils';

const buildConfig = (advisorSelection: boolean): TServiceTypeSettings[] => [
  {
    available: true,
    valueService: false,
    productPageForValueService: false,
    advisorSelection,
    serviceType: EServiceType.PickUpDropOff,
    engineType: false,
    appointmentSelection: true,
    transportationNeeds: false,
    checkRecallsExisting: false,
    checkRecallsNew: false,
  },
];

const buildOptions = (includeServiceValet: boolean): IFirstScreenOption[] =>
  includeServiceValet
    ? [
        {
          id: 1,
          name: 'Pick Up / Drop Off',
          type: EServiceType.PickUpDropOff,
          orderIndex: 1,
        },
      ]
    : [];

describe('booking sidebar utils advisor fallback', () => {
  it('uses config.advisorSelection for menu when service valet option is missing', () => {
    const menu = getCurrentMenu(
      EServiceType.PickUpDropOff,
      true,
      false,
      false,
      buildOptions(false),
      buildConfig(false),
      null
    );

    expect(menu).not.toContain('Advisor Selection');
  });

  it('keeps advisor in menu when config enables advisorSelection', () => {
    const menu = getCurrentMenu(
      EServiceType.PickUpDropOff,
      false,
      false,
      false,
      buildOptions(false),
      buildConfig(true),
      null
    );

    expect(menu).toContain('Advisor Selection');
  });

  it('keeps old behavior when service valet option exists', () => {
    const menu = getCurrentMenu(
      EServiceType.PickUpDropOff,
      false,
      false,
      false,
      buildOptions(true),
      buildConfig(true),
      null
    );

    expect(menu).not.toContain('Advisor Selection');
  });

  it('removes consultant step in steps list via config fallback', () => {
    const steps = getStepsScreen(
      EServiceType.PickUpDropOff,
      true,
      true,
      false,
      false,
      buildOptions(false),
      buildConfig(false),
      null
    );

    expect(steps).not.toContain('consultantSelection');
  });

  it('sets consultantSelection to -1 in steps map via config fallback', () => {
    const stepsMap = getStepsMap(
      EServiceType.PickUpDropOff,
      true,
      true,
      false,
      buildOptions(false),
      buildConfig(false)
    );

    expect(stepsMap.consultantSelection).toBe(-1);
    expect(stepsMap.appointmentTiming).toBe(3);
  });
});

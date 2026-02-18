export enum UserStatus {
  Active = 0,
  Inactive = 1,
  Removed = 2,
}

export interface IServiceCenter {
  id: number;
  name: string;
  dmsId?: string;
  position?: string;
  type?: number;
  displayOnBookingTypes?: number[];
}

export interface IDealership {
  id: number;
  name: string;
  serviceCenters: IServiceCenter[];
}

export const statusLabels: Record<UserStatus, string> = {
  [UserStatus.Active]: 'Active',
  [UserStatus.Inactive]: 'Inactive',
  [UserStatus.Removed]: 'Removed',
};

export interface IUserAccount {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  emailConfirmed: boolean;
  avatarPath: string;
  status: UserStatus;
  dealerships: IDealership[];
}

export const mockData: IUserAccount[] = [
  {
    id: '61018d0c-0c95-47b1-80b7-3188c4f0e1a7',
    firstName: '12',
    lastName: '2',
    fullName: '12 2',
    userName: 'oleh.b333lystiv@devabit.com',
    email: 'oleh.b333lystiv@devabit.com',
    role: 'BDC Agent',
    emailConfirmed: false,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 13,
        name: 'EvenFlow Dealert',
        serviceCenters: [{ id: 55, name: 'Dominion', position: '' }],
      },
    ],
  },
  {
    id: 'a6cf59cb-133a-4f5a-9e94-06cb2b1b08a5',
    firstName: '4',
    lastName: '4',
    fullName: '4 4',
    userName: 'oleh.blys33tiv@devabit.com',
    email: 'oleh.blys33tiv@devabit.com',
    role: 'BDC Agent',
    emailConfirmed: false,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 13,
        name: 'EvenFlow Dealert',
        serviceCenters: [{ id: 55, name: 'Dominion', position: '' }],
      },
    ],
  },
  {
    id: '973a1e68-c6be-43ef-a02c-e7e120817edb',
    firstName: 'ASadASD',
    lastName: 'asfsvasv',
    fullName: 'ASadASD asfsvasv',
    userName: 'tstsasdfasdfasdf@devabit.com',
    email: 'tstsasdfasdfasdf@devabit.com',
    role: 'Service Director',
    emailConfirmed: false,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 13,
        name: 'EvenFlow Dealert',
        serviceCenters: [{ id: 55, name: 'Dominion', dmsId: '', position: '' }],
      },
    ],
  },
  {
    id: '49264d5a-8445-494a-a214-836df354eb10',
    firstName: 'Advisor',
    lastName: 'First',
    fullName: 'Advisor First',
    userName: 'mihlovski+advisot1@gmail.com',
    email: 'mihlovski+advisot1@gmail.com',
    phoneNumber: '+380938549663',
    role: 'Advisor',
    emailConfirmed: false,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 13,
        name: 'EvenFlow Dealert',
        serviceCenters: [
          {
            id: 55,
            name: 'Dominion',
            dmsId: '997304',
            position: '',
            type: 0,
            displayOnBookingTypes: [0, 1],
          },
        ],
      },
    ],
  },
  {
    id: '78ae38bd-584c-41ac-9839-16bde2ca907e',
    firstName: 'Advisor',
    lastName: 'Second',
    fullName: 'Advisor Second',
    userName: 'mihlovski+company123@gmail.com',
    email: 'mihlovski+company123@gmail.com',
    phoneNumber: '+380938549663',
    role: 'Advisor',
    emailConfirmed: false,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 13,
        name: 'EvenFlow Dealert',
        serviceCenters: [
          {
            id: 55,
            name: 'Dominion',
            dmsId: '997313',
            position: '',
            type: 0,
          },
        ],
      },
    ],
  },
];

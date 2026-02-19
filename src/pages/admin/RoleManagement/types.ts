/* eslint-disable max-lines */

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
        id: 523463,
        name: 'EvenFlow Dealert Test Length',
        serviceCenters: [
          { id: 23678, name: 'Dominion Service Center Test Length', position: '' },
          { id: 5436, name: "Hennessy's River View Ford Main Service Drive", position: '' },
        ],
      },
      {
        id: 7745,
        name: 'EvenFlow Tekion',
        serviceCenters: [
          { id: 52362, name: 'Ternopil', position: '' },
          { id: 645363, name: 'Tenerife', position: '' },
        ],
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
        id: 23623623,
        name: 'EvenFlow Dealert',
        serviceCenters: [{ id: 235262, name: 'Dominion', position: '' }],
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
        id: 252462,
        name: 'EvenFlow Dealert',
        serviceCenters: [{ id: 6262, name: 'Dominion', dmsId: '', position: '' }],
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
        id: 5252,
        name: 'EvenFlow Dealert',
        serviceCenters: [
          {
            id: 673473,
            name: 'Dominion Test Service Center',
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
        id: 5436363,
        name: 'EvenFlow Dealert',
        serviceCenters: [
          {
            id: 63463,
            name: 'Dominion',
            dmsId: '997313',
            position: '',
            type: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'u6',
    firstName: 'Lydia',
    lastName: 'Hein',
    fullName: 'Lydia Hein',
    userName: 'lydia.hein@example.com',
    email: 'lydia.hein@example.com',
    role: 'Service Director',
    emailConfirmed: true,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 634634,
        name: 'Performance Steven Motors',
        serviceCenters: [
          { id: 5345673, name: 'Steven Motors RGB', position: '' },
          { id: 53467234, name: 'Steven Toyota', position: '' },
        ],
      },
      {
        id: 7542345,
        name: 'Brandon Steven Motors',
        serviceCenters: [
          { id: 634737, name: 'Brandon Center 1', position: '' },
          { id: 6745745, name: 'Brandon Center 2', position: '' },
        ],
      },
    ],
  },
  {
    id: 'u7',
    firstName: 'Eric',
    lastName: 'Young',
    fullName: 'Eric Young',
    userName: 'eric.young@example.com',
    email: 'eric.young@example.com',
    role: 'Advisor',
    emailConfirmed: true,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 34634634,
        name: 'Global Motors',
        serviceCenters: [
          { id: 63463, name: 'Global Kyiv', position: '' },
          { id: 20736736736, name: 'Global Lviv', position: '' },
        ],
      },
    ],
  },
  {
    id: 'u85151',
    firstName: 'Anna',
    lastName: 'Kovalenko',
    fullName: 'Anna Kovalenko',
    userName: 'anna.kovalenko@example.com',
    email: 'anna.kovalenko@example.com',
    role: 'Technician',
    emailConfirmed: false,
    avatarPath: '',
    status: UserStatus.Inactive,
    dealerships: [
      {
        id: 643634,
        name: 'Mercedes-Benz',
        serviceCenters: [{ id: 207, name: 'Mercedes Kharkiv', position: '' }],
      },
    ],
  },
  {
    id: 'u951',
    firstName: 'Dmytro',
    lastName: 'Shevchenko',
    fullName: 'Dmytro Shevchenko',
    userName: 'dmytro.shevchenko@example.com',
    email: 'dmytro.shevchenko@example.com',
    role: 'Advisor',
    emailConfirmed: true,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 634636,
        name: 'Ford Ukraine',
        serviceCenters: [{ id: 25223, name: 'Ford Dnipro', position: '' }],
      },
    ],
  },
  {
    id: 'u10654654',
    firstName: 'Olena',
    lastName: 'Bondar',
    fullName: 'Olena Bondar',
    userName: 'olena.bondar@example.com',
    email: 'olena.bondar@example.com',
    role: 'Technician',
    emailConfirmed: false,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 53453453,
        name: 'Audi Test',
        serviceCenters: [{ id: 209, name: 'Audi Kyiv', position: '' }],
      },
    ],
  },
  {
    id: 'u11636123',
    firstName: 'Taras',
    lastName: 'Melnyk',
    fullName: 'Taras Melnyk',
    userName: 'taras.melnyk@example.com',
    email: 'taras.melnyk@example.com',
    role: 'Advisor',
    emailConfirmed: true,
    avatarPath: '',
    status: UserStatus.Removed,
    dealerships: [
      {
        id: 543634,
        name: 'Renault Ukraine',
        serviceCenters: [{ id: 5345346, name: 'Renault Lviv', position: '' }],
      },
    ],
  },
  {
    id: 'uвіфвф6',
    firstName: 'Lydia',
    lastName: 'Hein',
    fullName: 'Lydia Hein',
    userName: 'lydia.hein@example.com',
    email: 'lydia.hein@example.com',
    role: 'Service Director',
    emailConfirmed: true,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 223523520,
        name: 'Performance Steven Motors',
        serviceCenters: [
          { id: 523673, name: 'Steven Motors RGB', position: '' },
          { id: 20453452, name: 'Steven Toyota', position: '' },
        ],
      },
      {
        id: 63463463,
        name: 'Brandon Steven Motors',
        serviceCenters: [
          { id: 206346345633, name: 'Brandon Center 1', position: '' },
          { id: 52352356, name: 'Brandon Center 2', position: '' },
        ],
      },
    ],
  },
  {
    id: 'u741241',
    firstName: 'Eric',
    lastName: 'Young',
    fullName: 'Eric Young',
    userName: 'eric.young@example.com',
    email: 'eric.young@example.com',
    role: 'Advisor',
    emailConfirmed: true,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 4523523,
        name: 'Global Motors',
        serviceCenters: [
          { id: 53256, name: 'Global Kyiv', position: '' },
          { id: 2023452366, name: 'Global Lviv', position: '' },
        ],
      },
    ],
  },
  {
    id: 'u318',
    firstName: 'Anna',
    lastName: 'Kovalenko',
    fullName: 'Anna Kovalenko',
    userName: 'anna.kovalenko@example.com',
    email: 'anna.kovalenko@example.com',
    role: 'Technician',
    emailConfirmed: false,
    avatarPath: '',
    status: UserStatus.Inactive,
    dealerships: [
      {
        id: 347,
        name: 'Mercedes-Benz',
        serviceCenters: [{ id: 207, name: 'Mercedes Kharkiv', position: '' }],
      },
    ],
  },
  {
    id: 'u9',
    firstName: 'Dmytro',
    lastName: 'Shevchenko',
    fullName: 'Dmytro Shevchenko',
    userName: 'dmytro.shevchenko@example.com',
    email: 'dmytro.shevchenko@example.com',
    role: 'Advisor',
    emailConfirmed: true,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 26436344,
        name: 'Ford Ukraine',
        serviceCenters: [{ id: 208, name: 'Ford Dnipro', position: '' }],
      },
    ],
  },
  {
    id: 'u1534530',
    firstName: 'Olena',
    lastName: 'Bondar',
    fullName: 'Olena Bondar',
    userName: 'olena.bondar@example.com',
    email: 'olena.bondar@example.com',
    role: 'Technician',
    emailConfirmed: false,
    avatarPath: '',
    status: UserStatus.Active,
    dealerships: [
      {
        id: 64534,
        name: 'Audi Group',
        serviceCenters: [{ id: 209, name: 'Audi Kyiv', position: '' }],
      },
    ],
  },
  {
    id: 'u11543543',
    firstName: 'Paras',
    lastName: 'Melnyk',
    fullName: 'Taras Melnyk',
    userName: 'taras.melnyk@example.com',
    email: 'taras.melnyk@example.com',
    role: 'Advisor',
    emailConfirmed: true,
    avatarPath: '',
    status: UserStatus.Removed,
    dealerships: [
      {
        id: 43413431,
        name: 'Renault Ukraine',
        serviceCenters: [{ id: 210, name: 'Renault Lviv', position: '' }],
      },
    ],
  },
];

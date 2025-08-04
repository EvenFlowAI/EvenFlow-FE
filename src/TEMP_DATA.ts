export const data = {
  result: [
    {
      id: 1,
      name: 'Service Campaign 1',
      isTextEnabled: false,
      communicationDetails: {
        textFrom: '123',
        textMessage: '12345',
      },
      filterRules: [
        {
          id: 20,
          type: 1,
          operator: 1,
          value: '1',
          isCriteria: true,
        },
        {
          id: 21,
          type: 2,
          operator: 1,
          value: '1',
          isCriteria: false,
        },
        {
          id: 22,
          type: 2,
          operator: 1,
          value: '1',
          isCriteria: false,
        },
      ],
      triggers: [
        {
          id: 20,
          daysFromListGeneration: 1,
          scheduledTime: '09:00:00',
        },
        {
          id: 21,
          daysFromListGeneration: 2,
          scheduledTime: '08:00:00',
        },
      ],
      serviceCenterId: 153,
    },
    {
      id: 2,
      name: 'Service Campaign 2',
      isTextEnabled: true,
      communicationDetails: {
        textFrom: '123',
        textMessage: '12345',
      },
      filterRules: [
        {
          id: 20,
          type: 1,
          operator: 1,
          value: '1',
          isCriteria: true,
        },
        {
          id: 21,
          type: 2,
          operator: 1,
          value: '1',
          isCriteria: false,
        },
        {
          id: 22,
          type: 2,
          operator: 1,
          value: '1',
          isCriteria: false,
        },
      ],
      triggers: [
        {
          id: 20,
          daysFromListGeneration: 1,
          scheduledTime: '09:00:00',
        },
        {
          id: 21,
          daysFromListGeneration: 2,
          scheduledTime: '08:00:00',
        },
      ],
      serviceCenterId: 153,
    },
    {
      id: 3,
      name: 'Service Campaign 3',
      isTextEnabled: false,
      communicationDetails: {
        textFrom: '',
        textMessage: '',
      },
      filterRules: [
        {
          id: 20,
          type: 1,
          operator: 1,
          value: '1',
          isCriteria: true,
        },
        {
          id: 21,
          type: 2,
          operator: 1,
          value: '1',
          isCriteria: false,
        },
        {
          id: 22,
          type: 2,
          operator: 1,
          value: '1',
          isCriteria: false,
        },
      ],
      triggers: [],
      serviceCenterId: 153,
    },
  ],
  paging: {
    numberOfPages: 1,
    numberOfRecords: 6,
  },
};

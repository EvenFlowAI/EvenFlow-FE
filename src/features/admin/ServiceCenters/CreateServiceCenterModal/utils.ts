const serverFieldMap: Record<string, string> = {
  name: 'scName',
  servicecenteremail: 'scEmail',
  phonenumber: 'scPhoneNumber',
  contactpersonalemail: 'cpEmail',
  'address.street': 'street',
  'address.city': 'city',
  'address.state': 'state',
  'address.zipcode': 'zipCode',
  timezoneid: 'timeZoneId',
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerErrorFields = (e: any): string[] => {
  const errors: { field?: string }[] = e?.response?.data?.errors ?? [];
  return errors
    .map(err => (err.field ? serverFieldMap[err.field.toLowerCase()] : undefined))
    .filter((f): f is string => Boolean(f));
};

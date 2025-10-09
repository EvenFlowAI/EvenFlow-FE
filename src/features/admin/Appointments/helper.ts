export const extractDuplicateAppointmentKey = (pathname: string): string | null => {
  const match = pathname.split('appointment-duplicate/')[1]?.split('/by-key')[0];
  return match ?? null;
};

import { TNotifications } from "../../../store/reducers/notifications/types";

export function checkPodsAreTheSame(
  localData: TNotifications[],
  remoteData: TNotifications[],
): boolean {
  return (
    localData.length === remoteData.length &&
    localData.every((localItem) => {
      return remoteData.find((remoteItem) => {
        return (
          remoteItem.id === localItem.id &&
          remoteItem.usersList?.length === localItem.usersList?.length &&
          remoteItem.usersList?.every(
            (remoteDataUsersList) =>
              localItem.usersList?.indexOf(remoteDataUsersList) !== -1,
          )
        );
      });
    })
  );
}

export function checkTransportationAreTheSame(
  localData: TNotifications[],
  remoteData: TNotifications[],
): boolean {
  return (
    localData.length === remoteData.length &&
    localData.every((localItem) => {
      return remoteData.find((remoteItem) => {
        return (
          remoteItem.id === localItem.id &&
          remoteItem.usersList?.length === localItem.usersList?.length &&
          remoteItem.usersList?.every(
            (remoteDataUsersList) =>
              localItem.usersList?.indexOf(remoteDataUsersList) !== -1,
          )
        );
      });
    })
  );
}

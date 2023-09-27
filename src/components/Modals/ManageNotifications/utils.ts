import {TPodNotifications} from "../../../store/reducers/notifications/types";

export function checkPodsAreTheSame(localData: TPodNotifications[], remoteData: TPodNotifications[]): boolean {
    return (localData.length === remoteData.length)
        &&
        localData.every(localItem => {
            return remoteData.find(remoteItem => {
                return remoteItem.podId === localItem.podId
                    && remoteItem.usersList?.length === localItem.usersList?.length
                    && remoteItem.usersList?.every(remoteDataUsersList => localItem.usersList?.indexOf(remoteDataUsersList) !== -1);

            });
        })
}

// export const checkPodsAreTheSame = (localData: TPodNotifications[], remoteData: TPodNotifications[]): boolean => {
//     let changesAreSaved = true;
//     if (remoteData.length !== localData.length) {
//         changesAreSaved = false;
//     } else {
//         localData.forEach(podData => {
//             const podExistsLocally = localData.find(el => el.podId === podData.podId)
//             const podExistsRemotely = remoteData.find(el => el.podId === podData.podId)
//             if (!podExistsLocally || !podExistsRemotely) {
//                 changesAreSaved = false;
//             } else {
//                 const currentPod = remoteData.find(el => el.podId === podData.podId)
//                 if (currentPod && podData.usersList) {
//                     if (currentPod.usersList?.length !== podData.usersList?.length) {
//                         changesAreSaved = false;
//                     } else {
//                         for (let userId of podData.usersList) {
//                             if (!currentPod.usersList?.includes(userId)) {
//                                 changesAreSaved = false;
//                                 return;
//                             }
//                         }
//                     }
//                 } else {
//                     changesAreSaved = false;
//                 }
//             }
//         })
//     }
//     return changesAreSaved;
// }
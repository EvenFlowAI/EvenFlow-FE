import {TPodNotifications} from "../../../store/reducers/notifications/types";

export const checkPodsAreTheSame = (localData: TPodNotifications[], remoteData: TPodNotifications[]): boolean => {
    let changesAreSaved = true;
    if (remoteData.length !== localData.length) {
        changesAreSaved = false;
    } else {
        localData.forEach(podData => {
            const podExistsLocally = localData.find(el => el.podId === podData.podId)
            const podExistsRemotely = remoteData.find(el => el.podId === podData.podId)
            if (!podExistsLocally || !podExistsRemotely) {
                changesAreSaved = false;
            } else {
                const currentPod = remoteData.find(el => el.podId === podData.podId)
                if (currentPod && podData.usersList) {
                    if (currentPod.usersList?.length !== podData.usersList?.length) {
                        changesAreSaved = false;
                    } else {
                        for (let userId of podData.usersList) {
                            if (!currentPod.usersList?.includes(userId)) {
                                changesAreSaved = false;
                                return;
                            }
                        }
                    }
                } else {
                    changesAreSaved = false;
                }
            }
        })
    }
    return changesAreSaved;
}
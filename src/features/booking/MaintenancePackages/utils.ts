import {IPackage} from "../../../api/types";
import {TComplimentary, TPackage, TService, TUpsell} from "./types";

export const getPackagesData = (loadedPackages: IPackage[]): [TPackage[], TService[], TComplimentary[], TUpsell[]] => {
    if (loadedPackages.length) {
        const loadedPackage = loadedPackages[0];
        const services: TService[] = [];
        const packages: TPackage[] = [];
        const complimentary: TComplimentary[] = [];
        const upsells: TUpsell[] = [];

        for (let option of loadedPackage.options.sort((a, b) => a.type - b.type)) {
            packages.push({
                ...option,
                moreIdx: []
            })
            for (let service of option.serviceRequests) {
                const pushedService = services.find(s => s.id === service.id);
                if (!pushedService) {
                    services.push({
                        ...service, packages: [option.id]
                    })
                } else if (!pushedService.packages.includes(option.id)) {
                    pushedService.packages = [...pushedService.packages, option.id];
                }
            }
            for (let comp of option.complimentaryServices) {
                const present = complimentary.find(c => c.id === comp.id);
                if (!present) {
                    complimentary.push({
                        ...comp,
                        packages: [option.id]
                    })
                } else if (!present.packages.includes(option.id)) {
                    present.packages = [...present.packages, option.id];
                }
            }
            if (option.intervalUpsells) {
                for (let upsell of option.intervalUpsells) {
                    const present = upsells.find(c => c.id === upsell.id);
                    if (!present) {
                        upsells.push({
                            ...upsell,
                            packages: [option.id]
                        })
                    } else if (!present.packages.includes(option.id)) {
                        present.packages = [...present.packages, option.id];
                    }
                }
            }
            services.reduce((acc, s, idx) => {
                if (acc.pck.length > s.packages.length) {
                    const lastPackageId = acc.pck[0];
                    const p = packages.find(p => p.id === lastPackageId);
                    if (p) {
                        p.lastIdx = idx - 1;
                        if (acc.moreIdx) {
                            const np = packages.find(el => el.id === acc.moreIdx);
                            if (np) {
                                np.moreIdx = [...acc.more];
                            }
                        }
                        acc.moreIdx = s.packages[0];
                        acc.more = [idx];
                    }
                } else if (acc.more.length) {
                    acc.more.push(idx);
                }
                if (idx === (services.length - 1) && acc.moreIdx) {
                    const np = packages.find(el => el.id === acc.moreIdx);
                    if (np) {
                        np.moreIdx = [...acc.more];
                    }
                }
                return {...acc, pck: s.packages};
            }, {pck: [], more: [], moreIdx: 0} as { pck: number[], more: number[], moreIdx: number });
        }

        return [packages, services, complimentary, upsells];
    }
    return [[], [], [], []];
}
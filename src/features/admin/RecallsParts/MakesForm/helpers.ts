import { IMake } from '../../../../api/types';
import { TIdName } from '../../../../store/reducers/recall/types';

export const SELECT_ALL_OPTION: TIdName = { id: -1, name: 'Select all' };

export const isSelectAll = (option?: TIdName | null): boolean =>
  option?.id === SELECT_ALL_OPTION.id;

const EXCLUDED_MAKES = ['other'];

export const mapMakesToOptions = (makes: IMake[]): TIdName[] =>
  [...(makes ?? [])]
    .filter(make => !EXCLUDED_MAKES.includes((make.name ?? '').trim().toLowerCase()))
    .map(make => ({ id: make.id, name: make.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

/** Makes flagged as supported for recalls (`isSupportedForRecalls`), limited to dropdown options. */
export const getAppliedMakes = (makes: IMake[], options: TIdName[]): TIdName[] => {
  const supportedIds = new Set(
    (makes ?? []).filter(make => make.isSupportedForRecalls).map(make => make.id)
  );
  return options.filter(option => supportedIds.has(option.id));
};

export const hasNewMakes = (draft: TIdName[], applied: TIdName[]): boolean =>
  draft.some(make => !applied.some(el => el.id === make.id));

import { IMake } from '../../../../api/types';
import { IRecall, TIdName } from '../../../../store/reducers/recall/types';

export const SELECT_ALL_OPTION: TIdName = { id: -1, name: 'Select all' };

export const isSelectAll = (option?: TIdName | null): boolean =>
  option?.id === SELECT_ALL_OPTION.id;

const EXCLUDED_MAKES = ['other'];

export const mapMakesToOptions = (makes: IMake[]): TIdName[] =>
  [...(makes ?? [])]
    .filter(make => !EXCLUDED_MAKES.includes((make.name ?? '').trim().toLowerCase()))
    .map(make => ({ id: make.id, name: make.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

const normalize = (value?: string) => (value ?? '').trim().toLowerCase();

/** Makes that are present in the loaded recalls, matched to dropdown options by id or name. */
export const getAppliedMakes = (recalls: IRecall[], options: TIdName[]): TIdName[] => {
  const recallMakes = new Map<number, TIdName>();
  (recalls ?? []).forEach(recall =>
    (recall.groups ?? []).forEach(group =>
      (group.items ?? []).forEach(item => {
        if (item.make) recallMakes.set(item.make.id, item.make);
      })
    )
  );

  const makes = Array.from(recallMakes.values());
  return options.filter(option =>
    makes.some(make => make.id === option.id || normalize(make.name) === normalize(option.name))
  );
};

export const hasNewMakes = (draft: TIdName[], applied: TIdName[]): boolean =>
  draft.some(make => !applied.some(el => el.id === make.id));

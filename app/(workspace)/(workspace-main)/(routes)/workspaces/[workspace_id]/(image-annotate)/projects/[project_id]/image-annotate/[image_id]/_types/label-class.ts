export enum LabelClassType {
  Background = 'background',
  Object = 'object',
}

export type ApiLabelClass = {
  id: string;
  name: string;
  order_index: number;
  parent_id: string | null;
  external_id: string | null;

  description: string;
  type: LabelClassType.Object | LabelClassType.Background;
  norder: number;
  color: string;
};

export const labelClassTypes = [
  LabelClassType.Object,
  LabelClassType.Background,
] as const;

export const labelClassTypesLabel = {
  [LabelClassType.Object]: 'Object',
  [LabelClassType.Background]: 'Semantic',
};

const fromBackend = ({ ...entry }: ApiLabelClass) => ({
  ...entry,
});

export type LabelClass = ReturnType<typeof fromBackend>;

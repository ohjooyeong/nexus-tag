export enum LabelClassType {
  SEMANTIC = 'SEMANTIC',
  OBJECT = 'OBJECT',
}

export type ApiLabelClass = {
  id: string;
  name: string;
  clientId: string | null;
  type: LabelClassType.OBJECT | LabelClassType.SEMANTIC;
  color: string;
};

export const labelClassTypes = [
  LabelClassType.OBJECT,
  LabelClassType.SEMANTIC,
] as const;

export const labelClassTypesLabel = {
  [LabelClassType.OBJECT]: 'OBJECT',
  [LabelClassType.SEMANTIC]: 'SEMANTIC',
};

const fromBackend = ({ ...entry }: ApiLabelClass) => ({
  ...entry,
});

export type LabelClass = ReturnType<typeof fromBackend>;

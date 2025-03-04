export enum LabelClassType {
  SEMANTIC = 'SEMANTIC',
  OBJECT = 'OBJECT',
}

export type LabelClass = {
  id: string;
  name: string;
  type: LabelClassType.OBJECT | LabelClassType.SEMANTIC;
  color: string;
  description?: string;
};

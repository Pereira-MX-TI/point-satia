export interface ColumnConfig {
  id: string;
  head: string;
  name: string;
  size: number;
  type: 'text' | 'img' | 'btn' | 'radio' | 'check' | 'alarm';
  buttons?: {
    icon: string;
    operation: string;
  }[];
}

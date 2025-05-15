export interface AttachFile {
  data: string;
  name: string;
  id: string | number;
  url: string;
  status: 'insert' | 'delete' | 'none';
}

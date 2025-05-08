export interface Address {
  id: string;
  description: string;
  zip_code: string;
  municipality: Municipality;
}

export interface Municipality {
  id: string;
  name: string;
  state: State;
}

export interface State {
  id: string;
  name: string;
}

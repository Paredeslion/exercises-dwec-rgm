export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Province {
  id: number;
  name: string;
}

export interface Town {
  id: number;
  name: string;
  // Server sometimes only returns th ID and sometimes the full Province object
  province: number | Province;
  // Necessary for map display
  latitude: number;
  longitude: number;
}

import { Property } from "./property";

// Basic localitation Interfaces
export interface Province {
  id: number;
  name: string;
}

export interface Town {
  id: number;
  name: string;
  provinceId: number;
}

// Response Server Interfaces
export interface ProvincesResponse {
  provinces: Province[];
}

export interface TownsResponse {
  towns: Town[];
}

export interface PropertiesResponse {
  properties: Property[];
}

export interface SinglePropertyResponse {
  property: Property;
}

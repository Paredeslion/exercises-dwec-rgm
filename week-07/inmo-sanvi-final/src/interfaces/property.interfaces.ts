import type { Town } from "./location.interfaces";
import type { User } from "./user.interfaces";

// Data to insert (what it sends to the form)
export interface PropertyInsert {
  title: string;
  description: string;
  price: number;
  address: string;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  townId: number; // When inserting, we only send the town ID
  mainPhoto: string; // Image is in base64 format
}

// Data received from the server
export interface Property extends Omit<PropertyInsert, "townId"> {
  id: number;
  town: Town; // When receiving, we get the full Town object
  mainPhoto: string; // when receiving, it's a URL
  createdAt?: string;
  status?: string;
  mine?: boolean; // Indicates if the property belongs to the logged-in user
  userId?: number; // ID of the user who owns the property
  // Optional rating fields
  totalRating?: number;
}

export interface PropertiesResponse {
  properties: Property[];
  currentPage: number; // For pagination
  more: boolean; // Indicates if there are more properties to load
}

export interface SinglePropertyResponse {
  property: Property;
}

// OPTIONAL PART Ratings
export interface RatingInsert {
  rating: number; // 1 to 5
  comment: string;
}

export interface Rating {
  id: number;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  user: User; // User who made the rating
}

export interface RatingsResponse {
  ratings: Rating[];
}

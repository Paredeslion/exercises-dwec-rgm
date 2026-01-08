// Necessary data to send a new house to server
export interface PropertyInsert {
  title: string;
  address: string;
  // To the server we send the town's ID
  townId: number;
  price: number;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  // Adding description
  description: string;
  mainPhoto: string;
}

// Property Interfaces inherits from Insert but removes TownID
// and adds the ID that the server returns
export interface Property extends Omit<PropertyInsert, 'townId'> {
  id: number;
  // We add the nested structure as it appears in the JSON
  town: {
    id: number;
    name: string;
    province: {
      id: number;
      name: string;
    }
  };
}

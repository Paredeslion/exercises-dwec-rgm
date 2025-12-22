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
  // Optional: If the server returns the complete town object, we would put it here.
  // For now, we'll leave it as is according to the instructions.
}

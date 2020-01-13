export interface Address {
    description?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    addressId?: string; // unique ID set in pinpoint
    placeId?: string;   // unique ID set in google
    addressStatus?: 'GEOCODED' | 'PROVISIONED'; // Status in backend api
    latitude?: string;
    longitude?: string;

}

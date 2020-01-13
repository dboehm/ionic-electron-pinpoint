import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Address} from './address';
import uuid from 'uuid/v1';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private storage: Storage) {
    }

    async saveAddress(address: Address): Promise<Address> {
        if (!address.addressId) {
            address.addressId = uuid();
        }
        await this.storage.set(address.addressId, address);
        return address;
    }

    async getAddresses(): Promise<Address[]> {
        const addresses = [];
        await this.storage.forEach(address => {
            if (address.addressId) {
                addresses.push(address);
            }
        });
        return addresses;
    }

    getAddress(addressId: string): Promise<Address> {
        return this.storage.get(addressId);
    }

    deleteAddress(addressId: string): Promise<any> {
        const addressPromise = this.getAddress(addressId);
        // addressPromise.then(a => address = a);
        return this.storage.remove(addressId);
    }
}

import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Address} from './address';
import uuid from 'uuid/v1';
import {ElectronService} from 'ngx-electron';
import {DispatcherService} from './dispatcher.service';
import {Endpoint} from './endpoint';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private electronService: ElectronService,
                private storage: Storage,
                private dispatcherService: DispatcherService
    ) {}

    async provisionAddressAsync(address: Address): Promise<Endpoint> {
        if (!address.addressId) {
            address = await this.saveAddress(address);
        }
        const endpoint = await this.getEndpoint();
        endpoint.address = address;
        return this.dispatcherService.saveEndpointAsync(endpoint);


    }

    async getEndpoint(): Promise<Endpoint> {
        const endpoint = await this.storage.get('endpoint');
        return endpoint || {};
    }

    async saveAddress(address: Address): Promise<Address> {
        if (!address.addressId) {
            address.addressId = uuid();
        }
        await this.storage.set(address.addressId, address);
        this.updateAddressMenu();
        return address;
    }

    async getAddresses(): Promise<Address[]> {
        const addresses = [];
        await this.storage.forEach(address => {
            if (address.addressId) {
                addresses.push(address);
            }
        });
        this.updateAddressMenu(addresses);
        return addresses;
    }

    getAddress(addressId: string): Promise<Address> {
        return this.storage.get(addressId);
    }

    async deleteAddress(addressId: string): Promise<any> {
        const addressPromise = this.getAddress(addressId);
        // addressPromise.then(a => address = a);
        await this.storage.remove(addressId);
        this.updateAddressMenu();
    }

    async updateAddressMenu(addressList: Address[] = null) {
         if (this.electronService.isElectronApp) {
            const addresses = addressList || await this.getAddresses();
            this.electronService.ipcRenderer.send('addr', addresses);
         }
    }
}

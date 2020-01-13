import {Component, OnInit} from '@angular/core';
import {Address} from '../address';
import {MapsService} from '../maps.service';
import {MouseEvent} from '@agm/core';
import {StorageService} from '../storage.service';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private  alertController: AlertController,
        private mapsService: MapsService,
        private storage: StorageService) {
        this.addresses.push(this.selectedAddress);
        this.addresses.push(this.secondAddress);
    }

    selectedAddress: Address = {
        addressLine1: 'Heinrich-Schütz-Str. 14',
        city: 'Dresden',
        state: 'SN',
        zipCode: '01277',
        latitude: '51.0455976',
        longitude: '13.8104503'
    };
    secondAddress: Address = {
        addressLine1: 'Merkel-Str. 28',
        city: 'Göttingen',
        state: 'NDS',
        zipCode: '37085',
        latitude: '51.5305767',
        longitude: '9.9532595'
    };

    addresses: Address[] = [];
    highlightedAddress: Address;

    async ngOnInit() {
        this.addresses = await this.storage.getAddresses();
    }

    public async onMapClick(event: MouseEvent) {
        const place = event.placeId || event.coords;
        const address = await this.mapsService.geocode(place);
        this.selectedAddress = await this.storage.saveAddress(address);
        this.addresses.push(this.selectedAddress);
    }

    async onDeleteClick(address: Address) {
        const alert = await this.alertController.create({
            header: 'Delete Address ?',
            message: 'Are you sure you want to delete this address ?',
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => console.log('Canceled - do nothing')
            },
                {
                    text: 'Delete it',
                    handler: () => this.doDelete(address)
                }]
        });
        await alert.present();
    }

    async doDelete(address: Address) {
        await this.storage.deleteAddress(address.addressId);
        this.highlightedAddress = null;
        // this.addresses = this.addresses.filter(addr => addr.addressId !== address.addressId);
        this.addresses = await this.storage.getAddresses();

    }
}

import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Address} from '../address';
import {MapsService} from '../maps.service';
import {MouseEvent} from '@agm/core';
import {StorageService} from '../storage.service';
import {AlertController, IonInput, ToastController} from '@ionic/angular';
import {ElectronService} from 'ngx-electron';
import {FormBuilder, FormGroup, FormArrayName, Validators} from '@angular/forms';
import {Endpoint} from '../endpoint';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    endpoint: Endpoint = {};
    endpointForm: FormGroup;
    @ViewChild('endpointName', {static: false}) nameField: IonInput;

    constructor(
        private  alertController: AlertController,
        private electron: ElectronService,
        private formBuilder: FormBuilder,
        private mapsService: MapsService,
        private ngZone: NgZone,
        private storage: StorageService,
        private toastController: ToastController) {
        this.initEndpointForm();
    }

    selectedAddress: Address = {
        addressLine1: 'Heinrich-Schütz-Str. 14',
        city: 'Dresden',
        state: 'SN',
        zipCode: '01277',
        latitude: '51.0455976',
        longitude: '13.8104503'
    };

    addresses: Address[] = [];
    highlightedAddress: Address;

    initEndpointForm() {
        const phonePattern = /^1[0-9]{10}$/;

        this.endpointForm = this.formBuilder.group({
            name: [this.endpoint.name, Validators.required],
            elin: [this.endpoint.elin, [Validators.required, Validators.pattern(phonePattern)]]
        });
    }

    async ngOnInit() {
        this.addresses = await this.storage.getAddresses();
        await this.loadEndpoint();
        if (!this.endpoint.name) {
            this.promptForInfo();
        }
        // this.addresses.push(this.selectedAddress);
        {
            if (this.electron.isElectronApp) {
                this.electron.ipcRenderer.on('setAddress', (event, addressId) => {
                    this.ngZone.run(() => this.setAddressById(addressId));
                });
            }
        }
    }

    public async onMapClick(event: MouseEvent) {
        const place = event.placeId || event.coords;
        const address = await this.mapsService.geocode(place);
        this.highlightedAddress = await this.storage.saveAddress(address);
        this.addresses.push(this.highlightedAddress);
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

    private async setAddressById(addressId: string) {
        const address = await this.storage.getAddress(addressId);
        if (address) {
            this.provisionAsync(address);
        }
        return undefined;
    }

    async saveEndpoint() {
        await this.storage.setEndpoint(this.endpointForm.value);
        return this.loadEndpoint();

    }


    private async loadEndpoint() {
        this.endpoint = await this.storage.getEndpoint();
        this.endpointForm.reset(this.endpoint);
        // return this.endpoint;
    }

    private async promptForInfo() {
        const toast = await this.toastController.create({
            position: 'bottom', //  'top', 'middle'
            duration: 5000,     //  time in ms
            closeButtonText: 'OK',
            showCloseButton: true,
            header: 'Provide Your Info',
            message: 'Pinpoint needs your name and phone number to set your current address.'
        });
        this.nameField.setFocus();
        await toast.present();

    }

   async provisionAsync(address: Address) {
        if (this.endpoint.elin && this.endpoint.name) {
           await  this.storage.provisionAddressAsync(address);
           this.selectedAddress = address;
           this.highlightedAddress = address;
        } else {
            this.promptForInfo();
        }
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Endpoint} from './endpoint';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DispatcherService {

    constructor(private http: HttpClient) {
    }

    public async saveEndpointAsync(endpoint: Endpoint) {
        const saved = endpoint.id
            ? await this.updateAsync(endpoint)
            : await this.addAsync(endpoint);
        return this.provisionAsync(saved);
    }

    private async addAsync(endpoint: Endpoint) {
        const url = `${environment.dispatcherUrl}/endpoints`;
        const ep = await this.http.post<Endpoint>(url, endpoint).toPromise();
        endpoint.id = ep.id;
        return endpoint;
    }

    private async updateAsync(endpoint: Endpoint) {
        const url = `${environment.dispatcherUrl}/endpoints/${endpoint.id}`;
        const ep = await this.http.put<Endpoint>(url, endpoint).toPromise();
        return endpoint;
    }

    private async provisionAsync(endpoint: Endpoint) {
        const url = `${environment.dispatcherUrl}/endpoints/${endpoint.id}/provision`;
        const ep = await this.http.put<Endpoint>(url, endpoint).toPromise();
        endpoint.address.addressStatus = ep.address.addressStatus;
        return endpoint;
    }
}

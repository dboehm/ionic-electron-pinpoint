import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AgmCoreModule, MapsAPILoader} from '@agm/core';
import {NgxElectronModule} from 'ngx-electron';

import {IonicStorageModule} from '@ionic/storage';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        AgmCoreModule.forRoot({
            // apiKey: 'you key here'
            apiKey: 'AIzaSyAcdDRbyC8Y9mETbwHMbKUKW7bhzwKQK4U',
            libraries: ['places', 'drawing', 'geometry']
        }),
        IonicStorageModule.forRoot({name: 'pinpoint'}),
        NgxElectronModule, HttpClientModule,
        BrowserModule, IonicModule.forRoot(), AppRoutingModule],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        // Preloading the Maps-API
        {
            provide: APP_INITIALIZER,
            useFactory: initMaps,
            deps: [MapsAPILoader],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
// factory method preloading the goggles map API
// can increase the app load time by perhaps loading the API over the web when NOT locally available
function initMaps(apiLoader: MapsAPILoader): () => Promise<void> {
    return () => apiLoader.load();
}

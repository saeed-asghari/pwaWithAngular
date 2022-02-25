import { Component } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { DataService } from './data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'jokes';
  update: boolean = false;
  joke: any;
  private readonly publicKey =
    'BGBAi_YVJceSt_YP1zupzpVSixB96kVthVFXMujq63VaZUNZfFtVobYkez-2jgfWH_9Nf4HvucNNqBmPsMfmfnw';
  constructor(
    updates: SwUpdate,
    private dataService: DataService,
    private swPush: SwPush
  ) {
    updates.available.subscribe((event) => {
      this.update = true;
      updates.activateUpdate().then(() => document.location.reload());
    });
  }

  ngOnInit() {
    this.pushSubscription();
    this.dataService.gimmeJokes().subscribe((res) => {
      this.joke = res;
    });
  }
  pushSubscription() {
    if (!this.swPush.isEnabled) {
      console.log('Notification is not enabled');
      return;
    }
    this.swPush
      .requestSubscription({
        serverPublicKey: this.publicKey,
      })
      .then((sub) => console.log(JSON.stringify(sub)))
      .catch((err) => console.log(err));
  }
}

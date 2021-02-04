import { Injectable, Inject } from '@angular/core';
import { StorageService, StorageTranscoders, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class CacheService {
  
  STORAGE_KEY = 'ImportosCacheing';
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.storage = storage.withDefaultTranscoder(StorageTranscoders.JSON);
  }
  public observeAPI(key: any, requist: any,houreToCache = 8) {
    let cached = this.getCacheAPI(key);
    if (cached == undefined) {
      let observable: Observable<any> = requist;
      observable.subscribe(z => {
        var CurrentTime = new Date()
        this.setCacheAPI(key,
          {
            data: z,
            date: new Date(CurrentTime.setMinutes(CurrentTime.getMinutes(), houreToCache*60*60))
          });
      })
      return observable;
    } else {
      console.log("GET FROM CACHE");
      return Observable.of(cached['data']);
    }
  }
  public setCacheAPI(key, obj) {
    this.storage.set(key, obj);
    return true;
  }
  public hasCacheAPI(key) {
    this.storage.has(key);
    return true;
  }
  public getCacheAPI(key) {
    var cached = this.storage.get(key) || undefined;
    try {

      console.log(cached.date <= new Date(), new Date(cached.date), new Date());
    } catch (Ex) { }
    if (cached != undefined && new Date(cached.date) <= new Date()) {
      console.log(cached.date <= new Date(), new Date(cached.date), new Date());
      this.removeCacheAPI(key);
      return undefined;
    }
    return cached;
  }
  public removeCacheAPI(key) {
    this.storage.remove(key);
  }
}

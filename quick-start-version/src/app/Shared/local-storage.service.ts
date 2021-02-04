import * as localforage from 'localforage';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import { fromPromise } from 'rxjs/observable/fromPromise';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   *
   * @param key
   * @param value
   * @returns {any}
   */
  public setItem<T>(key:string, value:T):Observable<T>{
    return fromPromise(localforage.setItem(key, value))
  }

  /**
   *
   * @param key
   * @returns {any}
   */
  public getItem<T>(key:string):Observable<T>{
    return fromPromise(localforage.getItem(key))
  }

  /**
   *
   * @param key
   * @returns {any}
   */
  public removeItem(key:string):Observable<void>{
    return fromPromise(localforage.removeItem(key))
  }
}
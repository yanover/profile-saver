import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IComputerInfo } from "../models/IComputerInfo";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private $dataQueue = new BehaviorSubject<IComputerInfo>(undefined);
  readonly dataQueue = this.$dataQueue.asObservable();

  constructor() {}

  setData(data: IComputerInfo) {
    this.$dataQueue.next(data);
  }

  getData(): Observable<IComputerInfo> {
    return this.dataQueue;
  }
}

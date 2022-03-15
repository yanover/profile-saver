import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IComputerInfo } from "../models/IComputerInfo";
import { IFolderInfo } from "../models/IFolderInfo";

@Injectable({
  providedIn: "root",
})
export class DataService {
  //IcomputerInfo
  private $computerInfo = new BehaviorSubject<IComputerInfo>(undefined);
  readonly computerInfo = this.$computerInfo.asObservable();
  private $destinationInfo = new BehaviorSubject<IFolderInfo>(undefined);
  readonly destinationInfo = this.$destinationInfo.asObservable();

  constructor() {}

  setComputerInfo(data: IComputerInfo) {
    this.$computerInfo.next(data);
  }

  getComputerInfo(): Observable<IComputerInfo> {
    return this.computerInfo;
  }

  setDestinationInfo(data: IFolderInfo) {
    this.$destinationInfo.next(data);
  }

  getDestinationInfo(): Observable<IFolderInfo> {
    return this.destinationInfo;
  }
}

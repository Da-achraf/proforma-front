import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RequestModel } from "../../../models/request.model";
import { User } from "../../../models/user/user.model";
import { RequestService } from "../../../services/request.service";
import { IRequestStrategy } from "./requests-strategies";

@Injectable({
    providedIn: 'root'
})
export class ByShipPointRequestStrategy implements IRequestStrategy {
    
    constructor(
        private requestService: RequestService,
    ){}

    getRequests(user: User): Observable<RequestModel[]> {
        return this.requestService.getAllRequestsByShipPoints(user.shipPointsIds || [])
    }

}
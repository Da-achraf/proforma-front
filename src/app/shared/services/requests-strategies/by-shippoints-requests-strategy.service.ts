import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RequestModel } from "../../../core/models/request.model";
import { User } from "../../../core/models/user/user.model";
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
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { RequestModel } from "../../../models/request.model";
import { User } from "../../../models/user/user.model";
import { RequestService } from "../../../services/request.service";
import { ShippointService } from "../../../services/shippoint.service";
import { IRequestStrategy } from "./requests-strategies";

@Injectable({
    providedIn: 'root'
})
export class ByShipPointRequestStrategy implements IRequestStrategy {
    
    constructor(
        private requestService: RequestService,
        private shipPointService: ShippointService
    ){}

    getRequests(user: User): Observable<RequestModel[]> {
        const shipPointsIds$ = this.shipPointService.getShipPoints().pipe(
            map(shipPoints => shipPoints.map(shipPoint => shipPoint.id_ship))
        )
        return this.requestService.getAllRequestsByShipPoints(user.plantsIds || [])
    }

}
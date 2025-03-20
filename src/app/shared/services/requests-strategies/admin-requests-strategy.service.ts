import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RequestModel } from "../../../core/models/request.model";
import { User } from "../../../core/models/user/user.model";
import { RequestService } from "../../../services/request.service";
import { IRequestStrategy } from "./requests-strategies";

@Injectable({
    providedIn: 'root'
})
export class AdminRequestStrategy implements IRequestStrategy {
    
    constructor(private requestService: RequestService){}

    getRequests(_: User): Observable<RequestModel[]> {
        return this.requestService.getAllRequests()
    }

}
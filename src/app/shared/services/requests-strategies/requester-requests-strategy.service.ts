import { inject, Injectable } from "@angular/core";
import { RequestModel } from "../../../models/request.model";
import { LoggedInUser, User } from "../../../models/user/user.model";
import { RequestService } from "../../../services/request.service";
import { Observable } from "rxjs";
import { IRequestStrategy } from "./requests-strategies";

@Injectable({
    providedIn: 'root'
})
export class RequesterRequestStrategy implements IRequestStrategy {
    
    constructor(private requestService: RequestService){}

    getRequests(user: User): Observable<RequestModel[]> {
        return this.requestService.getAllRequestsByUser(user.userId)
    }

}
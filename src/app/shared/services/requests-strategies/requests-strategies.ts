import { Observable } from "rxjs";
import { RequestModel } from "../../../core/models/request.model";
import { User } from "../../../core/models/user/user.model";

export interface IRequestStrategy {
    getRequests(user: User): Observable<RequestModel[]>
}
import { Observable } from "rxjs";
import { RequestModel } from "../../../models/request.model";
import { User } from "../../../models/user/user.model";

export interface IRequestStrategy {
    getRequests(user: User): Observable<RequestModel[]>
}
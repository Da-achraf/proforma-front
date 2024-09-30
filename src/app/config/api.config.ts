import { InjectionToken } from "@angular/core";
import { environment } from "../../environments/environment";


export const API_URL_TOKEN = new InjectionToken('API_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl
})


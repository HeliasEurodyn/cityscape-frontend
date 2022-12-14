import {Injectable} from '@angular/core';
import {CrudService} from '../common/crud.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDesignerService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'form-designer');
  }

  clearCache(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/clear-cache`);
  }

  getBusinessUnits(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/${this.endpoint}/business-units`);
  }

}

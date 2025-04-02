import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { IGNORE_HTTP_LOADER_INTERCEPTOR } from 'app/constants/ignore-http-loader-interceptor';
import { AuthService } from 'app/services/system/sofia/auth/auth.service';
import { NotificationService } from 'app/services/system/sofia/notification.service';
import { CompletedRmtTaskDTO } from 'app/dtos/cityscape/rmt/completed-task-dto';

@Injectable({
  providedIn: 'root'
})
export class RmtService {

  constructor(public http: HttpClient,
              private authService: AuthService,
              private notificationService: NotificationService) {
    this.startPolling();
  }

  // Function to fetch data from API
  fetchData(): Observable<CompletedRmtTaskDTO[]> {
    return this.http.get<CompletedRmtTaskDTO[]>(`${environment.serverUrl}/async-rmt/updates/`, { context: new HttpContext().set(IGNORE_HTTP_LOADER_INTERCEPTOR, true) });
  }

  private startPolling(): void {
    interval(20000) // 30 seconds interval
      .pipe(
        filter(() => this.authService.isUserLoggedIn()),
        switchMap(() => this.fetchData()
        ))
      .subscribe(
        data => { 
          console.log('API Response:', data);
          data.forEach(task => {
            const message = "Task with id " + task.risk_assessment_id + " has been completed. You can see the result on the Risk Assessments page.";
            this.notificationService.showNotification('top', 'center', 'alert', 'fa-thumbs-up', message);
          })
          
        },
        error => console.error('Error fetching data:', error)
      );
  }
}

import { HttpContextToken } from '@angular/common/http';

export const IGNORE_HTTP_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => false);
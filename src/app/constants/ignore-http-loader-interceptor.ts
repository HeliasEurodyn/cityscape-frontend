import { HttpContextToken } from '@angular/common/http';

export const IGNORE_HTTP_LOADER_INTERCEPTOR = new HttpContextToken<boolean>(() => false);
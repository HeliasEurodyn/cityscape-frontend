import { HttpContextToken } from '@angular/common/http';

export const IGNORE_INTERCEPTOR = new HttpContextToken<boolean>(() => false);
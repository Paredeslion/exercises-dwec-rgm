import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // We clone the request and add the server at the beginning.
  const reqClone = req.clone({
    url: `http://localhost:3000/${req.url}`
  });

  return next(reqClone);
};

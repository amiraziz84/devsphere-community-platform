import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Counter, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter<string>,

    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const method = request.method;
    let route = request.route?.path || request.url || 'unknown_route';

    // 🧠 Ignore Prometheus metrics scraping endpoint
    if (route === '/metrics') {
      return next.handle();
    }

    // 🕒 Start timing request
    const end = this.httpRequestDuration.startTimer({ method, route });

    return next.handle().pipe(
      tap(() => {
        // 🧾 Record duration and increment total requests counter
        end({ method, route });
        this.httpRequestsTotal.inc(
          { method, route, status: response.statusCode },
          1,
        );
      }),
    );
  }
}

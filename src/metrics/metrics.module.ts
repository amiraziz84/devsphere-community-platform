import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { MetricsInterceptor } from 'src/common/interceptors/metrics.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

const metricProviders = [
  makeCounterProvider({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
  }),
  makeHistogramProvider({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status'], 
    buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  }),
];

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: { enabled: false },
    }),
  ],
  providers: [
    ...metricProviders,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [PrometheusModule, ...metricProviders],
})
export class MetricsModule {}

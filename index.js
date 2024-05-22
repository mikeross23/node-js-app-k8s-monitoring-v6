var express = require('express');
var promClient = require('prom-client');

var app = express();

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add a default metrics collection that provides node metrics like heap size, event loop lag, etc.
promClient.collectDefaultMetrics({ register });

// Create a histogram metric for tracking request durations
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.2, 0.5, 1, 1.5, 2, 5],
});
register.registerMetric(httpRequestDurationMicroseconds);

// Create a counter for tracking the number of requests
const requestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code'],
});
register.registerMetric(requestCounter);

// Add a custom gauge for load average
const loadAverage = new promClient.Gauge({
  name: 'system_load_average',
  help: 'System load average over the last 1 minute',
});
register.registerMetric(loadAverage);

// Update load average gauge periodically
setInterval(() => {
  const loadavg = require('os').loadavg();
  loadAverage.set(loadavg[0]); // 1-minute load average
}, 10000);

// Middleware to track request duration and count
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, code: res.statusCode });
    requestCounter.inc({ method: req.method, route: req.route?.path || req.path, code: res.statusCode });
  });
  next();
});

app.get('/', function (req, res) {
    res.send('{ "response": "Hey There! This is Maksym" }');
});

app.get('/will', function (req, res) {
    res.send('{ "response": "Hello World! this is test page" }');
});

app.get('/ready', function (req, res) {
    res.send('{ "response": " Great!, It works!" }');
});

// Expose the metrics at /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`);
});

module.exports = app;

# Quick Status API Documentation

This document describes the REST API endpoints available in the Quick Status application.

## Base URL
```
http://localhost:3000/api
```

## Response Format
All responses are in JSON format. Error responses follow this structure:
```json
{
  "error": "Error message description"
}
```

## HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Services

### Get All Services
Retrieve all services with their status and outage information.

**Endpoint:** `GET /api/services`

**Response:**
```json
[
  {
    "name": "Example Service",
    "url": "https://example.com",
    "status": "operational",
    "uptime": "99.95",
    "responseTime": 150,
    "lastChecked": "7/19/2025, 10:30:00 AM",
    "createdAt": "2025-07-19T10:00:00.000Z",
    "outages": [
      {
        "id": "outage-id",
        "type": "down",
        "startTime": "2025-07-19T09:00:00.000Z",
        "endTime": "2025-07-19T09:30:00.000Z",
        "duration": 1800
      }
    ]
  }
]
```

### Create Service
Create a new service to monitor.

**Endpoint:** `POST /api/services`

**Request Body:**
```json
{
  "name": "My Service",
  "url": "https://myservice.com"
}
```

**Response:** `201 Created`
```json
{
  "id": "service-id",
  "name": "My Service",
  "url": "https://myservice.com",
  "onlineChecks": 0,
  "totalChecks": 0,
  "createdAt": "2025-07-19T10:00:00.000Z",
  "updatedAt": "2025-07-19T10:00:00.000Z"
}
```

### Get Service by ID
Retrieve a specific service by its ID.

**Endpoint:** `GET /api/services/{id}`

**Response:**
```json
{
  "id": "service-id",
  "name": "Example Service",
  "url": "https://example.com",
  "onlineChecks": 150,
  "totalChecks": 151,
  "lastStatus": "operational",
  "lastResponseTime": 120,
  "lastCheckedAt": "2025-07-19T10:30:00.000Z",
  "createdAt": "2025-07-19T10:00:00.000Z",
  "updatedAt": "2025-07-19T10:30:00.000Z",
  "outages": [...]
}
```

### Update Service
Update an existing service.

**Endpoint:** `PUT /api/services/{id}`

**Request Body (all fields optional):**
```json
{
  "name": "Updated Service Name",
  "url": "https://updated-url.com",
  "onlineChecks": 100,
  "totalChecks": 105,
  "lastResponseTime": 200,
  "lastStatus": "operational",
  "lastCheckedAt": "2025-07-19T10:30:00.000Z"
}
```

**Response:**
```json
{
  "id": "service-id",
  "name": "Updated Service Name",
  // ... other updated fields
}
```

### Delete Service
Delete a service and all its associated outages.

**Endpoint:** `DELETE /api/services/{id}`

**Response:**
```json
{
  "message": "Service deleted successfully"
}
```

---

## Service Outages

### Get Service Outages
Get all outages for a specific service.

**Endpoint:** `GET /api/services/{id}/outages`

**Response:**
```json
[
  {
    "id": "outage-id",
    "siteId": "service-id",
    "type": "down",
    "startTime": "2025-07-19T09:00:00.000Z",
    "endTime": "2025-07-19T09:30:00.000Z",
    "createdAt": "2025-07-19T09:00:00.000Z",
    "updatedAt": "2025-07-19T09:30:00.000Z"
  }
]
```

### Get Active Outage
Get the current active outage for a service (if any).

**Endpoint:** `GET /api/services/{id}/active-outage`

**Response:**
```json
{
  "id": "outage-id",
  "siteId": "service-id",
  "type": "degraded",
  "startTime": "2025-07-19T10:00:00.000Z",
  "endTime": null,
  "createdAt": "2025-07-19T10:00:00.000Z",
  "updatedAt": "2025-07-19T10:00:00.000Z"
}
```

If no active outage exists, returns `null`.

---

## Outages

### Get Outages by Site
Get outages for a specific service using query parameters.

**Endpoint:** `GET /api/outages?siteId={serviceId}`

**Response:**
```json
[
  {
    "id": "outage-id",
    "siteId": "service-id",
    "type": "down",
    "startTime": "2025-07-19T09:00:00.000Z",
    "endTime": "2025-07-19T09:30:00.000Z"
  }
]
```

### Create Outage
Create a new outage for a service.

**Endpoint:** `POST /api/outages`

**Request Body:**
```json
{
  "siteId": "service-id",
  "type": "down"
}
```

**Valid outage types:**
- `down` - Service is completely unavailable
- `degraded` - Service is partially available or slow
- `operational` - Service is working normally

**Response:** `201 Created`
```json
{
  "id": "outage-id",
  "siteId": "service-id",
  "type": "down",
  "startTime": "2025-07-19T10:00:00.000Z",
  "endTime": null,
  "createdAt": "2025-07-19T10:00:00.000Z",
  "updatedAt": "2025-07-19T10:00:00.000Z"
}
```

### Get Outage by ID
Retrieve a specific outage by its ID.

**Endpoint:** `GET /api/outages/{id}`

**Response:**
```json
{
  "id": "outage-id",
  "siteId": "service-id",
  "type": "down",
  "startTime": "2025-07-19T09:00:00.000Z",
  "endTime": "2025-07-19T09:30:00.000Z",
  "createdAt": "2025-07-19T09:00:00.000Z",
  "updatedAt": "2025-07-19T09:30:00.000Z"
}
```

### End Outage
Mark an outage as resolved by setting its end time.

**Endpoint:** `PUT /api/outages/{id}`

**Request Body:**
```json
{
  "action": "end"
}
```

**Response:**
```json
{
  "id": "outage-id",
  "siteId": "service-id",
  "type": "down",
  "startTime": "2025-07-19T09:00:00.000Z",
  "endTime": "2025-07-19T10:00:00.000Z",
  "createdAt": "2025-07-19T09:00:00.000Z",
  "updatedAt": "2025-07-19T10:00:00.000Z"
}
```

---

## Health Check

### Health Check
Simple endpoint to verify the API is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-07-19T10:30:00.000Z",
  "message": "Quick Status API is running"
}
```

---

## Error Handling

### 400 Bad Request
Returned when required parameters are missing or invalid.

```json
{
  "error": "Name and URL are required"
}
```

### 404 Not Found
Returned when a resource doesn't exist.

```json
{
  "error": "Service not found"
}
```

### 500 Internal Server Error
Returned when an unexpected error occurs on the server.

```json
{
  "error": "Failed to fetch services"
}
```

---

## Example Usage

### cURL Examples

**Create a new service:**
```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{"name": "My Website", "url": "https://mywebsite.com"}'
```

**Get all services:**
```bash
curl http://localhost:3000/api/services
```

**Create an outage:**
```bash
curl -X POST http://localhost:3000/api/outages \
  -H "Content-Type: application/json" \
  -d '{"siteId": "service-id", "type": "down"}'
```

**End an outage:**
```bash
curl -X PUT http://localhost:3000/api/outages/outage-id \
  -H "Content-Type: application/json" \
  -d '{"action": "end"}'
```

### JavaScript/Fetch Examples

**Get all services:**
```javascript
const response = await fetch('/api/services');
const services = await response.json();
```

**Create a service:**
```javascript
const response = await fetch('/api/services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My Service',
    url: 'https://myservice.com'
  })
});
const service = await response.json();
```

**Update a service:**
```javascript
const response = await fetch(`/api/services/${serviceId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Updated Service Name'
  })
});
const updatedService = await response.json();
```

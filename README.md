<p align="center">
  <a href="https://demo-quickstatus.justdiego.com/"><img src="https://img.shields.io/badge/view-demo-brightgreen" alt="view demo"></a>
  <a href="https://github.com/dewstouh/quick-status/actions/workflows/ci.yml"><img src="https://github.com/dewstouh/quick-status/actions/workflows/ci.yml/badge.svg?branch=main" alt="build status"></a>
</p>

<h1 align="center">
Quick Status
</h1>

# Demo
You can view a live demo of Quick Status here: https://demo-quickstatus.justdiego.com/

> A simple and lightweight status page for your services. Set up your status page in seconds and share it with your users. Easy configuration and deployment.

![](https://i.imgur.com/e3UnZu9.gif)

# Features
- **Easy to Use**: Quick setup with minimal configuration.
- **REST API**: Full REST API for programmatic service management.
- **Customizable**: Tailor the status page to fit your brand.
- **Real-time Updates**: Instant updates to your service status.
- **Responsive Design**: Looks great on all devices.
- **Open Source**: Free to use and modify.
- **Self-Hosted**: Run it on your own server for full control.
- **Lightweight**: Minimal dependencies for fast performance.

# Configuration
Quick Status is configured using a simple TXT file. You can easily add or remove services, set their status, and customize the appearance of your status page.

## Example Configuration
You can setup your services in `sites.txt` at the root of the project.:
```txt
# Format: ServiceName=ServiceURL

GitHub=https://github.com
OpenAI=https://openai.com
Vercel=https://vercel.com
Netlify=https://netlify.com
AWS=https://aws.amazon.com
```

# Installation

## Quick Start with Docker (Recommended)

The fastest way to get Quick Status running:

```bash
# Option 1: Build and run directly from GitHub
docker build -t quick-status https://github.com/dewstouh/quick-status.git#main:docker/images/quick-status
docker run -p 3000:3000 quick-status

# Option 2: Clone and use docker-compose
git clone https://github.com/dewstouh/quick-status.git
cd quick-status/docker/images/quick-status
docker compose up
```

Visit http://localhost:3000 to see your status page!

## Using Git (Development)

1. Clone the repository:
```bash
git clone https://github.com/dewstouh/quick-status.git
```

2. Install the dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

## Building for Production
To build the application for production, run:
```bash
pnpm run build
```

<video src="https://i.imgur.com/dfvDlj7.mp4" controls width="100%">
</video>

# Testing

## Seeding the Database
```
npx turbo db:seed
```
<video src="https://i.imgur.com/MbxP6nX.mp4" controls width="100%">
</video>

To run tests, use the following command:
```bash
pnpm test
```

<video src="https://i.imgur.com/7et4hsj.mp4" controls width="100%">
</video>

## Testing Workflows Locally
I personally use `act` to test the workflows locally. You can install it using:

```bash
brew install act
```

And then just start the workflow with:
```bash
act
```
<video src="https://i.imgur.com/ChvYXGa.mp4" controls width="100%">
</video>


# How it works
Quick Status monitors the services listed in `sites.txt` by checking their availability and response time every 30s or every refresh.

# API Documentation

Quick Status provides a comprehensive REST API for programmatically managing services and outages. The API allows you to:

- **Manage Services**: Create, read, update, and delete monitored services
- **Track Outages**: Create and manage service outages and incidents  
- **Monitor Status**: Get real-time service status and uptime information
- **Access History**: Retrieve historical outage data and service metrics

## Quick API Reference

### Services
- `GET /api/services` - Get all services with status info
- `POST /api/services` - Create a new service
- `GET /api/services/{id}` - Get specific service details
- `PUT /api/services/{id}` - Update service information
- `DELETE /api/services/{id}` - Remove a service

### Outages  
- `GET /api/outages?siteId={id}` - Get outages for a service
- `POST /api/outages` - Create a new outage
- `GET /api/outages/{id}` - Get specific outage details
- `PUT /api/outages/{id}` - End an outage

### Health Check
- `GET /api/health` - API health status

## Example Usage

```bash
# Get all services
curl http://localhost:3000/api/services

# Create a new service
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{"name": "My Website", "url": "https://mywebsite.com"}'

# Create an outage
curl -X POST http://localhost:3000/api/outages \
  -H "Content-Type: application/json" \
  -d '{"siteId": "service-id", "type": "down"}'
```

📖 **[Full API Documentation](apps/web/app/api/README.md)**

All endpoints return JSON responses and follow RESTful conventions. No authentication is currently required.


# Roadmap
- [ ] Add simple registration system to manage service tracking from web interface
- [ ] Add Favicons

# History behind Quick Status
Quick Status was created out of a need for a simple, lightweight status page solution for **[Quickfra](https://quickfra.com)** that could be set up quickly and easily. Many existing solutions were either too complex or bloated with features that weren't necessary for the use case. Quick Status aims to provide a straightforward, no-frills status page that can be deployed in seconds and be configured with minimal effort.


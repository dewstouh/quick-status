# Quick Status Docker Image

This directory contains a simple Docker setup for running Quick Status directly from the GitHub repository.

## Quick Start

### Option 1: Using Docker (Simplest)

```bash
# Build the image
docker build -t quick-status https://github.com/dewstouh/quick-status.git#main:docker/images/quick-status

# Run the container
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/packages/db/prisma \ # Persist data
  quick-status
```

### Option 2: Using Docker Compose

```bash
# Clone the repository
git clone https://github.com/dewstouh/quick-status.git
cd quick-status/docker/images/quick-status

# Start the application
docker compose up
```

### Option 3: Build from local source

```bash
# Clone the repository
git clone https://github.com/dewstouh/quick-status.git
cd quick-status/docker/images/quick-status

# Build and run
docker build -t quick-status .
docker run -p 3000:3000 quick-status
```

## Accessing the Application

Once running, you can access:
- **Web Application**: http://localhost:3000
- The application will automatically initialize with sample data

## Environment Variables

You can customize the deployment using environment variables:

```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e NODE_ENV=production \
  quick-status
```

## Persistent Data

To persist the SQLite database:

```bash
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/packages/db/prisma \
  quick-status
```

## Health Check

The container includes a health check that monitors the application status. You can check it with:

```bash
docker ps
```

Look for the health status in the STATUS column.

## Troubleshooting

- If the build fails, ensure you have a stable internet connection for cloning the repository
- If the application doesn't start, check the logs with: `docker logs <container-id>`
- The database is automatically initialized on first run

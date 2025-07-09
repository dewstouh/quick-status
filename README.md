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
## Using Git

1. Clone the repository:
```bash
git clone github.com/dewstouh/quick-status.git
```

2. Install the dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

# How it works
Quick Status monitors the services listed in `sites.txt` by checking their availability and response time every 30s or every refresh.

# History behind Quick Status
Quick Status was created out of a need for a simple, lightweight status page solution for **[Quickfra](https://quickfra.com)** that could be set up quickly and easily. Many existing solutions were either too complex or bloated with features that weren't necessary for the use case. Quick Status aims to provide a straightforward, no-frills status page that can be deployed in seconds and be configured with minimal effort.


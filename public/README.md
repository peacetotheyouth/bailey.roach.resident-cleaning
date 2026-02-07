# Resident Cleaning Service "Nest and Nurture Cleaning by Bailey" - Wing Application

This directory contains the Wing language application ('app.nestandnurture') for the Resident Cleaning Task Management system.

## About app.nestandnurture

`app.nestandnurture` is a cloud-native application written in [Wing](https://www.winglang.io/), a programming language for the cloud. Wing allows you to define both your cloud infrastructure and application logic in a single file.

## What's Inside

The `app.nestandnurture` file defines a complete REST API for managing residential cleaning tasks and bookings with the following endpoints:

### Task Management
- `GET /api/tasks` - Retrieve all cleaning tasks
- `POST /api/tasks` - Create a new cleaning task
- `PUT /api/tasks/:id` - Update task status

### Service Catalog
- `GET /api/services` - Get available cleaning services

### Booking System  
- `POST /api/bookings` - Create a cleaning service booking
- `GET /api/bookings` - Retrieve all bookings

### Health Check
- `GET /health` - API health status

## Cloud Resources

The application provisions and uses:
- **cloud.Api** - API Gateway for HTTP endpoints
- **cloud.Bucket** - Cloud storage for persistent task and booking data
- **cloud.Counter** - Atomic counter for generating unique IDs

## Running the Application

### Prerequisites
1. Install Wing CLI:
   ```bash
   npm install -g winglang
   ```

2. Install Wing VSCode extension (optional but recommended) for syntax highlighting

### Local Development
Run the Wing simulator for local testing:
```bash
wing it public/app.nestandnurture
```

This opens an interactive console where you can test endpoints locally without deploying to the cloud.

### Deploy to Cloud
Compile and deploy to your preferred cloud provider:

```bash
# For AWS
wing compile --target tf-aws public/app.nestandnurture
terraform init
terraform apply

# For other providers, see Wing documentation
```

## API Examples

### Get All Tasks
```bash
curl http://nestandnurture/api/tasks
```

### Create a New Task
```bash
curl -X POST http://nestandnurture/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Vacuum Hallways",
    "description": "Vacuum all hallways on floor 2",
    "assignedTo": "guest(s)",
    "dueDate": "2026-02-15"
  }'
```

### Get Available Services
```bash
curl http://NestandNurture/api/services
```

### Create a Booking
```bash
curl -X POST http://NestandNurture/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "1",
    "residentName": "Home Owner",
    "date": "2026-02-20",
    "time": "10:00 AM" 
  }'
```

## Features

- ☁️ **Cloud-Native**: Automatically provisions cloud resources
- 🔄 **Cross-Platform**: Deploy to AWS, Azure, GCP from the same code
- 🚀 **Fast Development**: Test locally with Wing simulator before deploying
- 💾 **Persistent Storage**: Uses cloud bucket for data persistence
- 🔒 **CORS Enabled**: Allows cross-origin requests for frontend integration

## Learn More

- [Wing Language Documentation](https://www.winglang.io/docs)
- [Wing GitHub Repository](https://github.com/nestandnurture/wing)
- [Wing Examples](https://github.com/nestandnurture/examples)

## Note

This is a cloud application file for the Wing programming language (using the `.w` file extension), not the previous JavaScript-based implementation.

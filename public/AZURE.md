# Deploying to Microsoft Azure

This document outlines the steps to deploy this Instagram-like application to Microsoft Azure.

## Prerequisites

1. An active Microsoft Azure account
2. Azure CLI installed (optional, but helpful)
3. Node.js and npm installed

## Deployment Steps

### 1. Build the Application

First, build the application for production:

```bash
npm run build
```

This will create a `dist` folder with the production-ready application.

### 2. Create an Azure Static Web App

You can deploy this React application to Azure Static Web Apps, which is perfect for static content and front-end applications:

1. Go to the [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web App" and select it
4. Click "Create"
5. Fill in the details:
   - Subscription: Select your subscription
   - Resource Group: Create a new one or use an existing one
   - Name: Give your app a name (e.g., "instaclone")
   - Region: Select the closest region to your users
   - SKU: Free (for testing) or Standard (for production)
   - Source: Select the repository source (GitHub, Azure DevOps, etc.)
   - Repository details: Link to your repository
   - Build Presets: React
   - App location: "/" (root)
   - Api location: "api" (if you have an API)
   - Output location: "dist"

6. Click "Review + create"
7. After validation passes, click "Create"

### 3. Configure CI/CD (Optional)

Azure Static Web Apps automatically set up GitHub Actions for continuous deployment if you selected GitHub as your source. If you're using another repository source, follow the Azure documentation to set up CI/CD.

### 4. Custom Domain (Optional)

To add a custom domain:

1. Go to your Static Web App in the Azure Portal
2. Click "Custom domains"
3. Add your domain and follow the verification steps

### 5. Production Considerations

For a production-ready application, consider:

1. Setting up environment variables for API keys and other secrets
2. Configuring authentication if needed (Azure Static Web Apps supports authentication)
3. Setting up monitoring and analytics
4. Implementing a proper backend service for user data and media storage (Azure Functions, Azure App Service, etc.)
5. Using Azure Blob Storage for storing user-uploaded media files

## Further Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
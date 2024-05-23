# node-js-app-k8s-monitoring-v6

# Project contains simple Node.js app and Prometheus/Grafana/Loki monitoring stack deployment to Kubernetes

This guide walks through deploying a Node.js application along with a Prometheus and Grafana monitoring stack on Kubernetes using Minikube.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js and npm](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Step 1: Initialize Node.js Application

1. Create a directory for your Node.js app and navigate into it:

```sh
   git clone https://github.com/mikeross23/node-js-app-k8s-monitoring-v6
   cd node-js-app-k8s-monitoring-v6
```

2. Start Node.js application:

```sh
   npm init
```

3. Start Minikube

```sh
   minikube start
```

4. Create namespaces for the application and monitoring stack:

```sh
   kubectl create namespace app
   kubectl create namespace monitoring
```

5. Deploy the Node.js application:

```sh
   kubectl apply -f app-deployment.yaml
   kubectl apply -f app-service.yaml
```

6. Deploy Prometheus:

```sh
   kubectl apply -f prometheus-config.yaml
   kubectl apply -f prometheus-deployment.yaml
   kubectl apply -f prometheus-service.yaml
```

7. Deploy Grafana:

```sh
   kubectl apply -f grafana-deployment.yaml
   kubectl apply -f grafana-service.yaml
```

8. Deploy Loki:

```sh
   kubectl apply -f loki-configmap.yaml
   kubectl apply -f loki-deployment.yaml
   kubectl apply -f loki-service.yaml
```

9. Deploy Promtail:

```sh
   kubectl apply -f promtail-deployment.yaml
```

10. Verify the deployments and services:

```sh
   kubectl get pods -n app
   kubectl get svc -n app
   kubectl get pods -n monitoring
   kubectl get svc -n monitoring
```

11. Access to Grafana:

```sh
   minikube service grafana -n monitoring
```

12. Log in to Grafana with default credentials:
    username="admin",
    password="admin".
13. Add data source:

- Click Connections in the left-side menu.
- Enter the name of a specific data source in the search dialog (Prometheus or Loki).
- Click the data source you want to add.
- Configure the data source following instructions:
  1.  Add URL of your Prometheus server http://prometheus.monitoring.svc.cluster.local:9090
  2.  Click "Save & test"
  3.  Add URL of your Loki server
      http://<minikube_ip>:32000

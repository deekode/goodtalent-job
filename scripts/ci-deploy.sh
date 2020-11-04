#! /bin/bash
set -e

COMMIT_SHA1=$CIRCLE_SHA1
ENV=$CIRCLE_BRANCH

export COMMIT_SHA1=$COMMIT_SHA1
export ENV=$CIRCLE_BRANCH

envsubst < ./k8s/staging/deployments.yml > deployments.yml


echo "$KUBERNETES_CLUSTER_CERTIFICATE" | base64 --decode > cert.crt
echo "$KUBERNETES_TOKEN" | base64 --decode > ./kube_ca

./kubectl \
  --kubeconfig=/dev/null \
  --server=$KUBERNETES_SERVER \
  --certificate-authority=cert.crt \
  --token="$(cat ./kube_ca)" \
  apply -f ./deployments.yml
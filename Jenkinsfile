pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '460249938865'
        ECS_CLUSTER = 'project-poc-ecs-cluster'

        FRONTEND_REPO = 'project-poc-frontend'
        BACKEND_REPO = 'project-poc-backend'

        FRONTEND_SERVICE = 'project-poc-frontend-service'
        BACKEND_SERVICE = 'project-poc-backend-service'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Application') {
            steps {
                sh '''
                    echo "Checking frontend dependencies..."
                    test -f frontend/package-lock.json

                    echo "Checking backend dependencies..."
                    test -f backend/package-lock.json

                    echo "Checking Dockerfiles..."
                    test -f frontend/Dockerfile
                    test -f backend/Dockerfile

                    echo "Application structure validated."
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build \
                      --build-arg NGINX_CONFIG=nginx.aws.conf \
                      -t hospital-frontend:build-${BUILD_NUMBER}-${GIT_COMMIT} \
                      ./frontend

                    docker build \
                      -t hospital-backend:build-${BUILD_NUMBER}-${GIT_COMMIT} \
                      ./backend
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                    sh '''
                        set -eu

                        REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

                        aws ecr get-login-password --region "$AWS_REGION" | \
                          docker login --username AWS --password-stdin "$REGISTRY"

                        docker tag hospital-frontend:build-${BUILD_NUMBER}-${GIT_COMMIT} \
                          "$REGISTRY/$FRONTEND_REPO:$BUILD_NUMBER"

                        docker tag hospital-backend:build-${BUILD_NUMBER}-${GIT_COMMIT} \
                          "$REGISTRY/$BACKEND_REPO:$BUILD_NUMBER"

                        docker push "$REGISTRY/$FRONTEND_REPO:$BUILD_NUMBER"
                        docker push "$REGISTRY/$BACKEND_REPO:$BUILD_NUMBER"
                    '''
            }
        }


        stage('Deploy to ECS') {
            steps {
                    sh '''
                        set -eu

                        REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

                        deploy_service() {
                            FAMILY="$1"
                            CONTAINER="$2"
                            SERVICE="$3"
                            REPOSITORY="$4"

                            IMAGE="$REGISTRY/$REPOSITORY:$BUILD_NUMBER"

                            echo "Deploying $SERVICE with image $IMAGE"

                            aws ecs describe-task-definition \
                              --task-definition "$FAMILY" \
                              --region "$AWS_REGION" \
                              --query taskDefinition \
                              --output json > current-task.json

                            # Verify the expected container exists
                            jq -e --arg CONTAINER "$CONTAINER" \
                              '.containerDefinitions | any(.name == $CONTAINER)' \
                              current-task.json > /dev/null

                            jq --arg IMAGE "$IMAGE" \
                               --arg CONTAINER "$CONTAINER" '
                              .containerDefinitions |= map(
                                if .name == $CONTAINER
                                then .image = $IMAGE
                                else .
                                end
                              )
                              | del(
                                  .taskDefinitionArn,
                                  .revision,
                                  .status,
                                  .requiresAttributes,
                                  .compatibilities,
                                  .registeredAt,
                                  .registeredBy,
                                  .deregisteredAt
                                )
                            ' current-task.json > new-task.json

                            NEW_TASK_ARN=$(aws ecs register-task-definition \
                              --cli-input-json file://new-task.json \
                              --region "$AWS_REGION" \
                              --query 'taskDefinition.taskDefinitionArn' \
                              --output text)

                            echo "Registered task definition: $NEW_TASK_ARN"

                            aws ecs update-service \
                              --cluster "$ECS_CLUSTER" \
                              --service "$SERVICE" \
                              --task-definition "$NEW_TASK_ARN" \
                              --region "$AWS_REGION" \
                              --query 'service.{Name:serviceName,TaskDefinition:taskDefinition}' \
                              --output table

                            echo "Waiting for $SERVICE to become stable..."

                            aws ecs wait services-stable \
                              --cluster "$ECS_CLUSTER" \
                              --services "$SERVICE" \
                              --region "$AWS_REGION"

                            echo "$SERVICE deployment completed."
                        }

                        deploy_service \
                          "project-poc-frontend" \
                          "frontend" \
                          "$FRONTEND_SERVICE" \
                          "$FRONTEND_REPO"

                        deploy_service \
                          "project-poc-backend" \
                          "backend" \
                          "$BACKEND_SERVICE" \
                          "$BACKEND_REPO"
                    '''
            }
        }

    }

    post {
        success {
            echo 'Jenkins pipeline completed successfully.'
        }

        failure {
            echo 'Jenkins CI pipeline failed. Check stage logs.'
        }
    }
}

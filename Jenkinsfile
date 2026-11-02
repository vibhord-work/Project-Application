pipeline {
    agent any


    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube-Cloud') {
                        sh """
                            "${scannerHome}/bin/sonar-scanner" \
                              -Dsonar.projectKey=vibhord-work_HospitalDBMS-DevOps \
                              -Dsonar.organization=vibhord-work \
                              -Dsonar.sources=backend,frontend/src \
                              -Dsonar.host.url=https://sonarcloud.io
                        """
                    }
                }
            }
        }
    }
}
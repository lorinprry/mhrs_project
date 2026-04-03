pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to Ubuntu') {
            steps {
                sshagent(['ubuntu-ssh']) {
                    sh '''
                    ssh -p 2222 lorin@127.0.0.1 "
                        cd ~/mhrs_project || git clone https://github.com/lorinprry/mhrs_project.git ~/mhrs_project &&
                        cd ~/mhrs_project &&
                        git pull &&
                        docker-compose down || true &&
                        docker-compose up -d --build
                    "
                    '''
                }
            }
        }
    }
}
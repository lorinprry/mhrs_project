pipeline {
    agent any

    stages {
        stage('CHECK') {
            steps {
                echo 'JENKINSFILE CALISIYOR'
            }
        }

        stage('DEPLOY') {
            steps {
                sh '''
                chmod 600 /var/jenkins_home/.ssh/ubuntu_key

                ssh -i /var/jenkins_home/.ssh/ubuntu_key -o StrictHostKeyChecking=no -p 2222 lorin@192.168.25.250 "
                    mkdir -p ~/mhrs_project &&
                    if [ ! -d ~/mhrs_project/.git ]; then
                        git clone https://github.com/lorinprry/mhrs_project.git ~/mhrs_project
                    fi &&
                    cd ~/mhrs_project &&
                    git pull origin main &&
                    docker compose down || true &&
                    docker compose up -d --build
                "
                '''
            }
        }
    }
}
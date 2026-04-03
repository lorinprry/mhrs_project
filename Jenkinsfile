pipeline {
    agent any

    stages {
        stage('NEW FILE CHECK') {
            steps {
                echo 'YENI JENKINSFILE CALISTI'
            }
        }

        stage('Deploy to Ubuntu') {
            steps {
                sshagent(credentials: ['93e7edb9-93ce-4170-9635-c56203897862']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no -p 2222 lorin@127.0.0.1 "
                        cd ~/mhrs_project || git clone https://github.com/lorinprry/mhrs_project.git ~/mhrs_project
                        cd ~/mhrs_project
                        git pull
                        docker compose down || true
                        docker compose up -d --build
                    "
                    '''
                }
            }
        }
    }
}
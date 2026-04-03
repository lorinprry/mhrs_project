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
                withCredentials([sshUserPrivateKey(
                    credentialsId: '93e7edb9-93ce-4170-9635-c56203897862',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                    chmod 600 "$SSH_KEY"

                    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -p 2222 "$SSH_USER"@192.168.25.250 "
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
}
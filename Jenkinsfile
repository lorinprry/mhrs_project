pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Jenkins calisiyor'
            }
        }

        stage('List Files') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }
    }
}
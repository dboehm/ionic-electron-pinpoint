pipeline {
  agent any
  stages {
    stage('Build Assets') {
      steps {
        dir(path: 'electron') {
          sh 'npm install'
          sh 'npm run scss:prod'
          sh 'npm run script:prod'
        }

      }
    }

  }
}
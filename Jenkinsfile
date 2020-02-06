pipeline {
  agent {
    node {
      label 'Tester'
    }

  }
  stages {
    stage('Test') {
      agent {
        node {
          label 'TestAgent'
        }

      }
      steps {
        pwd(tmp: true)
        echo 'Hello'
      }
    }

  }
}
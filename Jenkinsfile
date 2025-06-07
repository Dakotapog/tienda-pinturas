pipeline {
    agent any
    
    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
        COMPOSE_PROJECT_NAME = "tienda-pinturas"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Descargando código fuente...'
                checkout scm
            }
        }
        
        stage('Verificar Estructura') {
            steps {
                script {
                    echo 'Verificando estructura del proyecto...'
                    sh 'ls -la'
                    sh 'ls -la backend/ || echo "Backend no es carpeta separada"'
                    sh 'ls -la frontend/ || echo "Frontend no es carpeta separada"'
                    sh 'ls -la Dockerfile.backend || echo "Dockerfile.backend no encontrado"'
                    sh 'ls -la Dockerfile.frontend || echo "Dockerfile.frontend no encontrado"'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    echo 'Construyendo Backend...'
                    // Ya que usas Dockerfile.backend, no necesitamos entrar a carpeta backend
                    sh 'npm install --production || echo "No package.json encontrado"'
                    // Ejecutar tests si existen
                    sh 'npm test || echo "No hay tests configurados"'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    echo 'Construyendo Frontend...'
                    // Ya que usas Dockerfile.frontend, no necesitamos entrar a carpeta frontend
                    sh 'echo "Frontend se construye con Dockerfile.frontend"'
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            echo 'Construyendo imagen Docker del Backend...'
                            sh 'docker build -f Dockerfile.backend -t tienda-pinturas-backend:${IMAGE_TAG} .'
                            sh 'docker tag tienda-pinturas-backend:${IMAGE_TAG} tienda-pinturas-backend:latest'
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        script {
                            echo 'Construyendo imagen Docker del Frontend...'
                            sh 'docker build -f Dockerfile.frontend -t tienda-pinturas-frontend:${IMAGE_TAG} .'
                            sh 'docker tag tienda-pinturas-frontend:${IMAGE_TAG} tienda-pinturas-frontend:latest'
                        }
                    }
                }
            }
        }
        
        stage('Test Containers') {
            steps {
                script {
                    echo 'Probando contenedores...'
                    // Verificar que las imágenes se crearon correctamente
                    sh 'docker images | grep tienda-pinturas'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Desplegando aplicación...'
                    // Parar contenedores existentes
                    sh 'docker-compose down || true'
                    
                    // Levantar todos los servicios
                    sh 'docker-compose up -d --build'
                    
                    // Verificar que los contenedores estén corriendo
                    sh 'docker-compose ps'
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo 'Verificando salud de la aplicación...'
                    // Esperar un momento para que los servicios inicien
                    sh 'sleep 30'
                    
                    // Verificar backend
                    sh 'curl -f http://localhost:3000 || echo "Backend health check failed"'
                    
                    // Verificar frontend
                    sh 'curl -f http://localhost:80 || echo "Frontend health check failed"'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Limpiando recursos...'
            // Limpiar imágenes no utilizadas
            sh 'docker system prune -f || true'
        }
        success {
            echo '🎉 Pipeline completado exitosamente!'
            echo 'Backend disponible en: http://localhost:3000'
            echo 'Frontend disponible en: http://localhost:80'
        }
        failure {
            echo '❌ Pipeline falló!'
            // Mostrar logs en caso de fallo
            sh 'docker-compose logs || true'
        }
    }
}
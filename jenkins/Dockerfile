FROM jenkins/jenkins:lts
USER root

# Instalar Git primero
RUN apt-get update && \
    apt-get install -y git && \
    git --version

# Instalar Docker
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# Instalar Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Limpiar cache de apt
RUN apt-get clean && rm -rf /var/lib/apt/lists/*   

# Configurar Git globalmente
RUN git config --global user.name "Jenkins CI" && \
    git config --global user.email "jenkins@localhost" && \
    git config --global init.defaultBranch main

USER jenkins

# Copiar archivo de plugins
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins

# Configurar Jenkins para usar Git
ENV JENKINS_OPTS="--httpPort=8080"
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"

# Instalar plugins básicos
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
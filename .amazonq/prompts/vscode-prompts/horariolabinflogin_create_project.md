1. Criar as pastas:  
  a) backend  
  b) frontend  
  c) mobile  
  d) infraestrutura  

2. Na pasta backend, criar um projeto node javascript com suporte vite, express, sequelize mysql, mongoose mongo. Via wsl, executar npm install no projeto.

3. Na pasta frontend, criar um projeto react js javascript como suporte a vite e MUI para a interface web. Via wsl, executar npm install no projeto.

4. Na pasta mobile, criar um projeto react native javascript com suporte metro expo. Via wsl, executar npm install no projeto.

5) Na pasta infraestrutura, criar tres pastas, mysql, mongo e flyway. Na pasta, mysql criar uma pasta dump. Na pasta mongo, criar a pasta dump. Na pasta flyway, criar a estrutura de pastas para implantação das tabelas mysql (vazia).

6. Na pasta horariolabinfologin criar o docker-compose.yml para criar os serviços:  
  a) frontend  
  b) backend  
  c) mobile  

  6.1. Correção: no backend corrija o seguinte erro:
  > horariolabinflogin-backend@1.0.0 start
  > node src/server.js
  node:internal/errors:496
      ErrorCaptureStackTrace(err);
      ^
  Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'cors' imported from /app/src/server.js
      at new NodeError (node:internal/errors:405:5)
      at packageResolve (node:internal/modules/esm/resolve:916:9)
      at moduleResolve (node:internal/modules/esm/resolve:973:20)
      at defaultResolve (node:internal/modules/esm/resolve:1206:11)
      at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
      at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
      at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
      at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
      at link (node:internal/modules/esm/module_job:75:36) {
    code: 'ERR_MODULE_NOT_FOUND'
  }

7. Na pasta infraestrutura, criar o docker-compose.yml para criar os serviços:  
  a) mongo  
  b) mysql  
  c) flyway  
  d) portainer  

8. A rede referenciada em ambos docker-compose.yml é horariolabinf-network.

9. Não inclua o version: '3.8' no docker-compose.yml

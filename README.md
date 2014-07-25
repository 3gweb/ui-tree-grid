ui-tree-grid
============

Esta diretiva permite criar tabelas com sub linhas

# Colaboradores

Time ui-tree-grid:
* [Guilherme Mangabeira Gregio](http://github.com/guilhermegregio)
* [Rafael Antonio Lucio](https://github.com/rafaellucio)

# Instalação

```shell
bower install ui-tree-grid --save
```

# Configuração

CSS
```html
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"/>
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css"/>
<link rel="stylesheet" href="ui-tree-grid/css/ui-tree-grid.min.css"/>
```
   
Scripts
```html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.20/angular.min.js"></script>
<script type="application/javascript" src="ui-tree-grid/js/ui-tree-grid.min.js"></script>
```

# Uso

```html
<div
    ng-init="data = [{name: 'Guilherme'},{name: 'Rafael'}];"
    ui-grid=""
    data="data"
></div>
```

# Opções


- data

   **Required**
   
   Recebe array com os dados da grid caso deseja utilizar sub grid será utilizado o nó children
   
   ```json 
   [{name: 'GUilherme'}]
   ```

- columns
 
   **Opcional**
   
   Informa as colunas que devem ser utilizadas pela grid

- search-text

   **Opcional**
   
   Passar o model que será utilizado para efetuar busca nos dados

- select-row 

   **Opcional**
   
   Modificar o evento de select de linha

- icon-template

   **Opcional**
   
   Incluir template com icone

# Teste

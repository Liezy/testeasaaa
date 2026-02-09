# Frontend Vanilla JS - Changelog

Seu frontend em Vanilla JavaScript está configurado para consumir a API Django de releases.

## Estrutura de Pastas

```
├── templates/                 # Templates HTML Django
│   └── changelog.html        # Página de changelog
├── static/
│   ├── js/
│   │   └── changelog.js      # JavaScript da página de changelog
│   └── css/
│       └── style.css         # Estilos CSS
```

## Como Funciona

### 1. Template HTML (`templates/changelog.html`)
- Usa `{% load static %}` para carregar os arquivos estáticos
- Referencia JavaScript e CSS com `{% static 'arquivo' %}`
- Container HTML onde o JavaScript injeta os releases

### 2. JavaScript (`static/js/changelog.js`)
- Faz fetch na API `/api/releases/`
- Processa os dados retornados
- Renderiza dinamicamente os cards de release

### 3. CSS (`static/css/style.css`)
- Estilos responsivos e modernos
- Layout com cards para os releases

## Como Usar

### Acessar a Página
```
http://127.0.0.1:8000/api/releases/changelog/
```

### Adicionar Novo Arquivo JS
1. Crie um arquivo em `static/js/seu_arquivo.js`
2. Reference-o no template:
```html
<script src="{% static 'js/seu_arquivo.js' %}"></script>
```

### Adicionar Novo Arquivo CSS
1. Crie um arquivo em `static/css/seu_arquivo.css`
2. Reference-o no template:
```html
<link rel="stylesheet" href="{% static 'css/seu_arquivo.css' %}">
```

### Usar em Desenvolvimento
```bash
python manage.py runserver
```

Os arquivos estáticos são servidos automaticamente em `DEBUG = True`.

### Coletar Estáticos para Produção
```bash
python manage.py collectstatic
```

Isso copia todos os arquivos de `static/` e apps para `staticfiles/`.

## API Disponível

### GET `/api/releases/`
Retorna lista de todos os releases em ordem decrescente por data.

### GET `/api/releases/latest/`
Retorna o release mais recente.

### POST `/api/releases/sync/` (requer autenticação)
Cria um novo release. Usado pelo GitHub Actions.

## Exemplos de Uso

### Chamar a API do JavaScript
```javascript
fetch('/api/releases/')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Erro:', error));
```

### Criar um novo endpoint
1. Crie a view em `releases/views.py`
2. Adicione a URL em `releases/urls.py`
3. Crie o template em `templates/`
4. Reference-o com `{% static %}`

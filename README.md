# Sistema da papelaria

Projeto didático em Python com interface no navegador e o banco MySQL do script original. As cinco tabelas têm as quatro operações de um CRUD: **cadastrar, consultar, editar e excluir**.

| Tela | Chave do registro | Dados principais |
| --- | --- | --- |
| Clientes | ID automático | Nome, CPF, contato e cadastro |
| Colaboradores | Matrícula digitada | Nome, cargo, admissão e salário |
| Fornecedores | ID automático | Empresa, CNPJ e contato |
| Produtos | ID automático | Nome, código, estoque e preços |
| Transações | Número automático | Data, pagamento e valor |

## Preparar o MySQL

Instale e inicie o MySQL. Na pasta do projeto, execute:

```bash
mysql -u root -p < sql/papelaria.sql
```

Esse arquivo é o SQL enviado pelo autor do banco. Corrigi somente a primeira linha, que estava com um comentário SQL inválido, e retirei três comandos finais que dependiam de variáveis ausentes no trecho enviado. A estrutura e os registros das cinco tabelas foram preservados.

**Atenção:** o arquivo inclui nomes, CPFs, CNPJs, telefones e e-mails de exemplo. Confirme com o autor que são fictícios antes de publicar o repositório. O script cria as tabelas; para importar novamente do zero, remova antes o banco de demonstração ou use outra instância MySQL.

## Rodar o sistema

No macOS ou Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD='SUA_SENHA'
export DB_NAME=papelaria
python -m streamlit run app.py
```

No Windows (PowerShell), ative o ambiente com `.venv\Scripts\Activate.ps1`. Defina as variáveis com `$env:DB_USER="root"`, `$env:DB_PASSWORD="SUA_SENHA"` e `$env:DB_NAME="papelaria"`; host e porta usam `localhost` e `3306` por padrão. Depois execute `python -m streamlit run app.py`.

Abra no navegador o endereço local mostrado pelo Streamlit. A senha fica em uma variável do seu computador; não a coloque no GitHub.

## Entender o código

1. Abra `tabelas.py`: ele descreve os campos das cinco tabelas e informa qual é a chave primária. É o mapa entre o SQL e os formulários.
2. Abra `app.py`: ele desenha as telas, recebe o que foi digitado e valida campos obrigatórios e códigos numéricos.
3. Abra `banco.py`: ele executa `SELECT`, `INSERT`, `UPDATE` e `DELETE`. Os valores digitados são enviados como parâmetros (`%s`).
4. Escolha uma tabela no menu lateral, crie um registro e veja a nova linha aparecer na consulta. Depois edite e exclua esse mesmo registro.

O SQL original não define relações entre as tabelas. Por isso, a tela de transações registra forma de pagamento e valor, mas não associa uma venda a um cliente ou produto. Isso pode ser uma evolução futura do banco.

## Acesso por link

O projeto roda localmente com o MySQL. Para acessar por um link fora do computador, será preciso hospedar a aplicação e um banco MySQL acessível por ela. **Como não há login, qualquer visitante do link poderá alterar ou apagar registros.** Use apenas dados de demonstração se publicar o aplicativo.

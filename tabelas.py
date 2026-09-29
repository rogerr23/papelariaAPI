"""Descrição das cinco tabelas do SQL original usada pelos formulários."""

# Cada campo: (nome no SQL, nome na tela, tipo, obrigatório, tamanho máximo).
TABELAS = {
    "Clientes": {
        "sql": "clientes", "chave": "id_cliente", "automatica": True,
        "titulo": "nome_completo", "busca": ("nome_completo", "cpf"),
        "campos": [
            ("nome_completo", "Nome completo", "texto", True, 150),
            ("cpf", "CPF (11 dígitos)", "digitos", True, 11),
            ("email", "E-mail", "texto", False, 150),
            ("telefone_celular", "Celular (11 dígitos)", "digitos", False, 11),
            ("data_cadastro", "Data de cadastro", "data_hora", True, None),
        ],
    },
    "Colaboradores": {
        "sql": "colaboradores", "chave": "matricula", "automatica": False,
        "titulo": "nome_completo", "busca": ("nome_completo", "cargo"),
        "campos": [
            ("nome_completo", "Nome completo", "texto", True, 150),
            ("cpf", "CPF (11 dígitos)", "digitos", True, 11),
            ("cargo", "Cargo", "texto", True, 100),
            ("data_admissao", "Data de admissão", "data", True, None),
            ("salario_base", "Salário base (R$)", "dinheiro", True, None),
        ],
    },
    "Fornecedores": {
        "sql": "fornecedores", "chave": "id_fornecedor", "automatica": True,
        "titulo": "nome_fantasia", "busca": ("razao_social", "nome_fantasia", "cnpj"),
        "campos": [
            ("razao_social", "Razão social", "texto", True, 150),
            ("nome_fantasia", "Nome fantasia", "texto", True, 100),
            ("cnpj", "CNPJ (14 dígitos)", "digitos", True, 14),
            ("telefone_comercial", "Telefone comercial", "texto", False, 20),
            ("email_faturamento", "E-mail de faturamento", "texto", False, 150),
            ("pessoa_contato", "Pessoa de contato", "texto", False, 100),
        ],
    },
    "Produtos": {
        "sql": "produtos", "chave": "id_produto", "automatica": True,
        "titulo": "nome_comercial", "busca": ("nome_comercial", "codigo_barras"),
        "campos": [
            ("nome_comercial", "Nome comercial", "texto", True, 100),
            ("descricao", "Descrição", "texto", False, 255),
            ("codigo_barras", "Código de barras (13 dígitos)", "digitos", True, 13),
            ("estoque_atual", "Estoque atual", "inteiro", True, None),
            ("estoque_minimo", "Estoque mínimo", "inteiro", True, None),
            ("valor_compra", "Valor de compra (R$)", "dinheiro", True, None),
            ("valor_venda", "Valor de venda (R$)", "dinheiro", True, None),
            ("unidade_medida", "Unidade de medida", "texto", True, 10),
            ("status", "Ativo", "booleano", True, None),
        ],
    },
    "Transações": {
        "sql": "transacoes", "chave": "numero_transacao", "automatica": True,
        "titulo": "forma_pagamento", "busca": ("forma_pagamento",),
        "campos": [
            ("data_hora", "Data e hora", "data_hora", True, None),
            ("forma_pagamento", "Forma de pagamento", "texto", True, 30),
            ("valor_total", "Valor total (R$)", "dinheiro", True, None),
        ],
    },
}

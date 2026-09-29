"""Interface didática para as cinco tabelas do banco da papelaria."""

from datetime import datetime, time
from decimal import Decimal

import mysql.connector
import streamlit as st

from banco import atualizar, criar, excluir, listar
from tabelas import TABELAS

st.set_page_config(page_title="Papelaria", page_icon="📚", layout="wide")
st.title("📚 Sistema da papelaria")
st.caption("Escolha uma tabela para consultar, cadastrar, editar ou excluir registros.")

nome_tabela = st.sidebar.radio("Tabela", list(TABELAS))
regra = TABELAS[nome_tabela]
st.header(nome_tabela)


def formulario(registro=None):
    """Desenha os campos e devolve um dicionário pronto para o banco."""
    registro = registro or {}
    dados = {}
    if not regra["automatica"] and not registro:
        dados[regra["chave"]] = st.number_input(
            "Matrícula *", min_value=1, step=1, value=1
        )
    elif registro:
        st.caption(f'{regra["chave"]}: {registro[regra["chave"]]}')

    for nome, rotulo, tipo, obrigatorio, tamanho in regra["campos"]:
        titulo = rotulo + (" *" if obrigatorio else "")
        valor = registro.get(nome)
        if tipo in ("texto", "digitos"):
            resposta = st.text_input(titulo, value=str(valor or ""), max_chars=tamanho)
            dados[nome] = resposta.strip() or None
        elif tipo == "inteiro":
            dados[nome] = st.number_input(titulo, min_value=0, step=1, value=int(valor or 0))
        elif tipo == "dinheiro":
            numero = st.number_input(titulo, min_value=0.0, step=0.01,
                                     value=float(valor or 0), format="%.2f")
            dados[nome] = Decimal(str(numero)).quantize(Decimal("0.01"))
        elif tipo == "booleano":
            dados[nome] = int(st.checkbox(titulo, value=bool(1 if valor is None else valor)))
        elif tipo == "data":
            dados[nome] = st.date_input(titulo, value=valor or datetime.now().date())
        elif tipo == "data_hora":
            momento = valor or datetime.now().replace(second=0, microsecond=0)
            dia = st.date_input(titulo + " — dia", value=momento.date())
            hora = st.time_input(titulo + " — hora", value=momento.time())
            dados[nome] = datetime.combine(dia, hora).replace(microsecond=0)
    return dados


def validar(dados):
    for nome, rotulo, tipo, obrigatorio, tamanho in regra["campos"]:
        valor = dados[nome]
        if obrigatorio and valor is None:
            return f"Preencha {rotulo}."
        if tipo == "digitos" and valor is not None:
            if len(valor) != tamanho or not valor.isdigit():
                return f"{rotulo} deve conter exatamente {tamanho} dígitos."
    return None


def identificacao(registro):
    return f'{registro[regra["chave"]]} — {registro[regra["titulo"]]}'


busca = st.text_input("Buscar", placeholder="Digite um nome, código ou forma de pagamento")
try:
    registros = listar(regra, busca)
except mysql.connector.Error as erro:
    st.error(f"Não foi possível acessar o MySQL: {erro}")
    st.info("Importe sql/papelaria.sql e confira as variáveis DB_* descritas no README.")
    st.stop()

st.subheader("Consultar")
if registros:
    st.dataframe(registros, hide_index=True, width="stretch")
else:
    st.info("Nenhum registro encontrado.")

aba_criar, aba_editar, aba_excluir = st.tabs(["Cadastrar", "Editar", "Excluir"])

with aba_criar:
    with st.form(f"criar_{nome_tabela}", clear_on_submit=True):
        novos_dados = formulario()
        salvar = st.form_submit_button("Cadastrar")
    if salvar:
        erro_validacao = validar(novos_dados)
        if erro_validacao:
            st.error(erro_validacao)
        else:
            try:
                criar(regra, novos_dados)
                st.toast("Registro cadastrado.")
                st.rerun()
            except mysql.connector.Error as erro:
                st.error(f"Não foi possível cadastrar: {erro}")

with aba_editar:
    if registros:
        escolhido = st.selectbox("Registro para editar", registros, format_func=identificacao)
        with st.form(f'editar_{nome_tabela}_{escolhido[regra["chave"]]}'):
            dados_editados = formulario(escolhido)
            salvar_edicao = st.form_submit_button("Salvar alterações")
        if salvar_edicao:
            erro_validacao = validar(dados_editados)
            if erro_validacao:
                st.error(erro_validacao)
            else:
                try:
                    atualizar(regra, escolhido[regra["chave"]], dados_editados)
                    st.toast("Registro atualizado.")
                    st.rerun()
                except mysql.connector.Error as erro:
                    st.error(f"Não foi possível atualizar: {erro}")
    else:
        st.info("Cadastre ou encontre um registro para editar.")

with aba_excluir:
    if registros:
        escolhido_exclusao = st.selectbox("Registro para excluir", registros,
                                         format_func=identificacao, key="excluir")
        confirmar = st.checkbox("Confirmo que quero excluir este registro")
        if st.button("Excluir", disabled=not confirmar):
            try:
                excluir(regra, escolhido_exclusao[regra["chave"]])
                st.toast("Registro excluído.")
                st.rerun()
            except mysql.connector.Error as erro:
                st.error(f"Não foi possível excluir: {erro}")
    else:
        st.info("Cadastre ou encontre um registro para excluir.")

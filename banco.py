"""As quatro operações CRUD do MySQL, compartilhadas pelas cinco tabelas."""

import os
from contextlib import contextmanager

import mysql.connector

from tabelas import TABELAS


@contextmanager
def conectar():
    conexao = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "papelaria"),
    )
    try:
        yield conexao
    finally:
        conexao.close()


def listar(regra, busca=""):
    """READ: procura nas colunas de busca e devolve os registros."""
    colunas = regra["busca"]
    filtros = " OR ".join(f"`{coluna}` LIKE %s" for coluna in colunas)
    sql = f'SELECT * FROM `{regra["sql"]}` WHERE {filtros} ORDER BY `{regra["chave"]}`'
    parametros = tuple(f"%{busca}%" for _ in colunas)
    with conectar() as conexao:
        cursor = conexao.cursor(dictionary=True)
        try:
            cursor.execute(sql, parametros)
            return cursor.fetchall()
        finally:
            cursor.close()


def criar(regra, dados):
    """CREATE: a chave é enviada apenas quando não é AUTO_INCREMENT."""
    colunas = list(dados)
    nomes = ", ".join(f"`{coluna}`" for coluna in colunas)
    marcadores = ", ".join("%s" for _ in colunas)
    sql = f'INSERT INTO `{regra["sql"]}` ({nomes}) VALUES ({marcadores})'
    with conectar() as conexao:
        cursor = conexao.cursor()
        try:
            cursor.execute(sql, tuple(dados.values()))
            conexao.commit()
        finally:
            cursor.close()


def atualizar(regra, chave, dados):
    """UPDATE: a chave identifica qual registro será alterado."""
    atribuicoes = ", ".join(f"`{coluna}` = %s" for coluna in dados)
    sql = f'UPDATE `{regra["sql"]}` SET {atribuicoes} WHERE `{regra["chave"]}` = %s'
    with conectar() as conexao:
        cursor = conexao.cursor()
        try:
            cursor.execute(sql, (*dados.values(), chave))
            conexao.commit()
        finally:
            cursor.close()


def excluir(regra, chave):
    """DELETE: remove um registro pela chave primária."""
    sql = f'DELETE FROM `{regra["sql"]}` WHERE `{regra["chave"]}` = %s'
    with conectar() as conexao:
        cursor = conexao.cursor()
        try:
            cursor.execute(sql, (chave,))
            conexao.commit()
        finally:
            cursor.close()

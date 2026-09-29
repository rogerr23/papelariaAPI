"use strict";

// Esta página é uma demonstração. O CRUD real em Python está em app.py e banco.py.
const tables = {
  clientes: {
    label: "Clientes", icon: "♙", key: "id_cliente", title: "nome_completo",
    description: "Organize os cadastros e os dados de contato dos clientes.",
    fields: [
      ["nome_completo", "Nome completo", "text", true, 150],
      ["cpf", "CPF", "digits", true, 11],
      ["email", "E-mail", "email", false, 150],
      ["telefone_celular", "Celular", "digits", false, 11],
      ["data_cadastro", "Data de cadastro", "datetime-local", true],
    ],
    seed: [{id_cliente:1,nome_completo:"Cliente Exemplo",cpf:"12345678901",email:"cliente@exemplo.com",telefone_celular:"11999999999",data_cadastro:"2026-09-01T09:15"}],
  },
  colaboradores: {
    label: "Colaboradores", icon: "♧", key: "matricula", manualKey: true, title: "nome_completo",
    description: "Consulte a equipe, cargos e datas de admissão.",
    fields: [
      ["nome_completo", "Nome completo", "text", true, 150],
      ["cpf", "CPF", "digits", true, 11],
      ["cargo", "Cargo", "text", true, 100],
      ["data_admissao", "Data de admissão", "date", true],
      ["salario_base", "Salário base (R$)", "money", true],
    ],
    seed: [{matricula:1001,nome_completo:"Colaborador Exemplo",cpf:"12312312312",cargo:"Atendimento",data_admissao:"2025-03-10",salario_base:2200}],
  },
  fornecedores: {
    label: "Fornecedores", icon: "▣", key: "id_fornecedor", title: "nome_fantasia",
    description: "Mantenha os dados das empresas que abastecem a papelaria.",
    fields: [
      ["razao_social", "Razão social", "text", true, 150],
      ["nome_fantasia", "Nome fantasia", "text", true, 100],
      ["cnpj", "CNPJ", "digits", true, 14],
      ["telefone_comercial", "Telefone comercial", "text", false, 20],
      ["email_faturamento", "E-mail de faturamento", "email", false, 150],
      ["pessoa_contato", "Pessoa de contato", "text", false, 100],
    ],
    seed: [{id_fornecedor:1,razao_social:"Distribuidora Exemplo Ltda",nome_fantasia:"Distribuidora Exemplo",cnpj:"12345678000101",telefone_comercial:"1133334444",email_faturamento:"contato@exemplo.com",pessoa_contato:"Contato Exemplo"}],
  },
  produtos: {
    label: "Produtos", icon: "◫", key: "id_produto", title: "nome_comercial",
    description: "Acompanhe o catálogo, os preços e o estoque dos produtos.",
    fields: [
      ["nome_comercial", "Nome comercial", "text", true, 100],
      ["descricao", "Descrição", "text", false, 255],
      ["codigo_barras", "Código de barras", "digits", true, 13],
      ["estoque_atual", "Estoque atual", "integer", true],
      ["estoque_minimo", "Estoque mínimo", "integer", true],
      ["valor_compra", "Valor de compra (R$)", "money", true],
      ["valor_venda", "Valor de venda (R$)", "money", true],
      ["unidade_medida", "Unidade de medida", "text", true, 10],
      ["status", "Ativo", "boolean", true],
    ],
    seed: [
      {id_produto:1,nome_comercial:"Caderno universitário",descricao:"Caderno espiral",codigo_barras:"7891000000001",estoque_atual:45,estoque_minimo:10,valor_compra:18.5,valor_venda:29.9,unidade_medida:"UN",status:1},
      {id_produto:2,nome_comercial:"Caneta azul",descricao:"Ponta média",codigo_barras:"7891000000002",estoque_atual:120,estoque_minimo:20,valor_compra:0.8,valor_venda:1.5,unidade_medida:"UN",status:1},
      {id_produto:3,nome_comercial:"Papel A4",descricao:"Pacote com 500 folhas",codigo_barras:"7891000000003",estoque_atual:8,estoque_minimo:10,valor_compra:22,valor_venda:32.9,unidade_medida:"PCT",status:1},
    ],
  },
  transacoes: {
    label: "Transações", icon: "⇄", key: "numero_transacao", title: "forma_pagamento",
    description: "Visualize pagamentos, datas e valores registrados.",
    fields: [
      ["data_hora", "Data e hora", "datetime-local", true],
      ["forma_pagamento", "Forma de pagamento", "text", true, 30],
      ["valor_total", "Valor total (R$)", "money", true],
    ],
    seed: [{numero_transacao:1,data_hora:"2026-09-20T09:10",forma_pagamento:"Pix",valor_total:45.8}],
  },
};

const $ = (selector) => document.querySelector(selector);
const storageKey = (name) => `papelaria-demo-v1-${name}`;
let current = "produtos";
let editingKey = null;
let deletingKey = null;
let toastTimer;

function readRows(name) {
  try {
    const saved = localStorage.getItem(storageKey(name));
    if (saved !== null) {
      const rows = JSON.parse(saved);
      if (Array.isArray(rows)) return rows;
    }
  } catch (_) { /* armazenamento indisponível: usar os exemplos */ }
  return structuredClone(tables[name].seed);
}
function saveRows(name, rows) {
  try { localStorage.setItem(storageKey(name), JSON.stringify(rows)); }
  catch (_) { notify("Não foi possível salvar neste navegador."); }
}
function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}
function showTable(name) {
  current = name;
  const rule = tables[name];
  $("#page-title").textContent = rule.label;
  $("#breadcrumb").textContent = rule.label;
  $("#page-description").textContent = rule.description;
  $("#search").value = "";
  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.table === name);
    button.setAttribute("aria-current", button.dataset.table === name ? "page" : "false");
  });
  render();
}
function formatValue(value, type) {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "money") return Number(value).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
  if (type === "boolean") return Number(value) ? "Ativo" : "Inativo";
  if (type === "date") return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
  if (type === "datetime-local") return new Date(value).toLocaleString("pt-BR", {dateStyle:"short",timeStyle:"short"});
  return String(value);
}
function render() {
  const rule = tables[current];
  const rows = readRows(current);
  const query = $("#search").value.trim().toLocaleLowerCase("pt-BR");
  const visible = rows.filter(row => Object.values(row).some(value => String(value ?? "").toLocaleLowerCase("pt-BR").includes(query)));
  $("#count").textContent = rows.length;
  $("#result-count").textContent = `${visible.length} de ${rows.length} registro(s)`;
  const head = $("#table-head");
  const body = $("#table-body");
  head.replaceChildren(); body.replaceChildren();
  const headings = document.createElement("tr");
  [[rule.key,"ID"], ...rule.fields.map(field => [field[0],field[1]]), ["actions","Ações"]].forEach(([,label]) => {
    const th = document.createElement("th"); th.textContent = label; headings.append(th);
  });
  head.append(headings);
  if (!visible.length) {
    const tr = document.createElement("tr"), td = document.createElement("td");
    td.colSpan = rule.fields.length + 2; td.className = "empty"; td.textContent = "Nenhum registro encontrado.";
    tr.append(td); body.append(tr); return;
  }
  for (const row of visible) {
    const tr = document.createElement("tr");
    const id = document.createElement("td"); id.textContent = row[rule.key]; tr.append(id);
    for (const [name,,type] of rule.fields) {
      const td = document.createElement("td");
      if (type === "boolean") { const pill = document.createElement("span"); pill.className = `pill${Number(row[name]) ? "" : " off"}`; pill.textContent = formatValue(row[name],type); td.append(pill); }
      else { td.textContent = formatValue(row[name],type); td.title = td.textContent; }
      tr.append(td);
    }
    const actions = document.createElement("td"), wrap = document.createElement("div"); wrap.className = "actions";
    for (const [label,action] of [["Editar","edit"],["Excluir","delete"]]) {
      const button = document.createElement("button"); button.type = "button"; button.textContent = label;
      button.className = `action-button ${action}`; button.setAttribute("aria-label",`${label} ${row[rule.title]}`);
      button.addEventListener("click", () => action === "edit" ? openEditor(row[rule.key]) : openDelete(row[rule.key]));
      wrap.append(button);
    }
    actions.append(wrap); tr.append(actions); body.append(tr);
  }
}
function openEditor(key = null) {
  editingKey = key;
  const rule = tables[current];
  const row = key === null ? {} : readRows(current).find(item => item[rule.key] === key);
  if (key !== null && !row) return;
  $("#dialog-title").textContent = key === null ? `Novo ${rule.label.toLowerCase().slice(0,-1)}` : "Editar registro";
  $("#form-error").textContent = "";
  const fields = $("#form-fields"); fields.replaceChildren();
  if (rule.manualKey && key === null) addField(fields,[rule.key,"Matrícula","integer",true],{});
  for (const field of rule.fields) addField(fields,field,row);
  $("#editor").showModal();
}
function addField(container, field, row) {
  const [name,label,type,required,maxLength] = field;
  const wrapper = document.createElement("div"); wrapper.className = `field${["nome_completo","razao_social","nome_comercial","descricao"].includes(name) ? " wide" : ""}`;
  const title = document.createElement("label"); title.htmlFor = `input-${name}`; title.textContent = `${label}${required ? " *" : ""}`;
  const input = document.createElement("input"); input.id = `input-${name}`; input.name = name;
  input.type = type === "digits" ? "text" : type === "integer" || type === "money" ? "number" : type === "boolean" ? "checkbox" : type;
  if (type === "boolean") { input.className = "check"; input.checked = row[name] === undefined ? true : Boolean(Number(row[name])); }
  else if (type === "datetime-local") input.value = row[name] || new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);
  else if (type === "date") input.value = row[name] || new Date().toISOString().slice(0,10);
  else input.value = row[name] ?? "";
  if (maxLength) input.maxLength = maxLength;
  if (type === "digits") { input.inputMode = "numeric"; input.pattern = `[0-9]{${maxLength}}`; input.title = `Digite exatamente ${maxLength} números`; }
  if (type === "integer") { input.min = name === "matricula" ? "1" : "0"; input.step = "1"; }
  if (type === "money") { input.min = "0"; input.step = "0.01"; }
  input.required = required && type !== "boolean";
  wrapper.append(title,input); container.append(wrapper);
}
function submitForm(event) {
  event.preventDefault();
  const rule = tables[current], rows = readRows(current), form = event.currentTarget, data = {};
  for (const [name,,type] of rule.fields) {
    const input = form.elements.namedItem(name);
    data[name] = type === "boolean" ? Number(input.checked) : ["money","integer"].includes(type) ? Number(input.value) : input.value.trim() || null;
  }
  if (rule.manualKey && editingKey === null) {
    const matricula = Number(form.elements.namedItem(rule.key).value);
    if (rows.some(row => row[rule.key] === matricula)) { $("#form-error").textContent = "Essa matrícula já existe."; return; }
    data[rule.key] = matricula;
  }
  if (editingKey === null) {
    if (!rule.manualKey) data[rule.key] = Math.max(0,...rows.map(row => Number(row[rule.key]))) + 1;
    rows.push(data);
  } else {
    const index = rows.findIndex(row => row[rule.key] === editingKey);
    if (index < 0) return;
    rows[index] = {...rows[index],...data};
  }
  saveRows(current,rows); $("#editor").close(); render(); notify(editingKey === null ? "Registro cadastrado." : "Registro atualizado.");
}
function openDelete(key) {
  deletingKey = key;
  const rule = tables[current], row = readRows(current).find(item => item[rule.key] === key);
  if (!row) return;
  $("#confirm-text").textContent = `O registro “${row[rule.title]}” será removido desta demonstração no seu navegador.`;
  $("#confirm-dialog").showModal();
}

for (const [name,rule] of Object.entries(tables)) {
  const button = document.createElement("button"); button.type = "button"; button.className = "nav-item"; button.dataset.table = name;
  const icon = document.createElement("span"); icon.className = "nav-icon"; icon.textContent = rule.icon;
  const label = document.createElement("span"); label.className = "nav-text"; label.textContent = rule.label;
  button.append(icon,label); button.addEventListener("click", () => showTable(name)); $("#menu").append(button);
}
$("#search").addEventListener("input", render);
$("#new-button").addEventListener("click", () => openEditor());
$("#record-form").addEventListener("submit", submitForm);
$("#close-dialog").addEventListener("click", () => $("#editor").close());
$("#cancel-button").addEventListener("click", () => $("#editor").close());
$("#cancel-delete").addEventListener("click", () => $("#confirm-dialog").close());
$("#confirm-delete").addEventListener("click", () => {
  const rule = tables[current], rows = readRows(current).filter(row => row[rule.key] !== deletingKey);
  saveRows(current,rows); $("#confirm-dialog").close(); render(); notify("Registro excluído.");
});
$("#reset-button").addEventListener("click", () => {
  if (!window.confirm(`Restaurar os dados de exemplo de ${tables[current].label}?`)) return;
  try { localStorage.removeItem(storageKey(current)); } catch (_) { /* sem armazenamento */ }
  render(); notify("Dados de exemplo restaurados.");
});
showTable(current);

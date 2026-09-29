-- Banco de dados: `papelaria`
--
CREATE DATABASE IF NOT EXISTS `papelaria` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `papelaria`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nome_completo` varchar(150) NOT NULL,
  `cpf` char(11) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telefone_celular` char(11) DEFAULT NULL,
  `data_cadastro` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nome_completo`, `cpf`, `email`, `telefone_celular`, `data_cadastro`) VALUES
(1, 'Carlos Eduardo Silva', '12345678901', 'carlos.silva@email.com', '21987654321', '2026-09-01 09:15:00'),
(2, 'Mariana Oliveira Santos', '23456789012', 'mariana.santos@email.com', '21976543210', '2026-09-02 10:30:00'),
(3, 'Jo?o Pedro Almeida', '34567890123', 'joao.almeida@email.com', '21965432109', '2026-09-03 11:20:00'),
(4, 'Fernanda Costa Lima', '45678901234', 'fernanda.lima@email.com', '21954321098', '2026-09-04 14:10:00'),
(5, 'Rafael Martins Souza', '56789012345', 'rafael.souza@email.com', '21943210987', '2026-09-05 15:45:00'),
(6, 'Beatriz Rodrigues Alves', '67890123456', 'beatriz.alves@email.com', '21932109876', '2026-09-06 16:30:00'),
(7, 'Lucas Henrique Pereira', '78901234567', 'lucas.pereira@email.com', '21921098765', '2026-09-08 09:50:00'),
(8, 'Camila Ferreira Gomes', '89012345678', 'camila.gomes@email.com', '21910987654', '2026-09-09 13:25:00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `colaboradores`
--

CREATE TABLE `colaboradores` (
  `matricula` int(11) NOT NULL,
  `nome_completo` varchar(150) NOT NULL,
  `cpf` char(11) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  `data_admissao` date NOT NULL,
  `salario_base` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `colaboradores`
--

INSERT INTO `colaboradores` (`matricula`, `nome_completo`, `cpf`, `cargo`, `data_admissao`, `salario_base`) VALUES
(1001, 'Amanda Souza Ribeiro', '12312312312', 'Gerente', '2023-02-10', '4200.00'),
(1002, 'Bruno Henrique Costa', '23423423423', 'Vendedor', '2024-05-15', '2200.00'),
(1003, 'Carla Mendes Oliveira', '34534534534', 'Caixa', '2024-08-20', '2100.00'),
(1004, 'Diego Fernandes Lima', '45645645645', 'Estoquista', '2025-01-10', '2300.00'),
(1005, 'Elisa Martins Rocha', '56756756756', 'Vendedora', '2025-03-12', '2200.00'),
(1006, 'Gabriel Santos Pereira', '67867867867', 'Operador Gr?fico', '2025-06-02', '2500.00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `fornecedores`
--

CREATE TABLE `fornecedores` (
  `id_fornecedor` int(11) NOT NULL,
  `razao_social` varchar(150) NOT NULL,
  `nome_fantasia` varchar(100) NOT NULL,
  `cnpj` char(14) NOT NULL,
  `telefone_comercial` varchar(20) DEFAULT NULL,
  `email_faturamento` varchar(150) DEFAULT NULL,
  `pessoa_contato` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `fornecedores`
--

INSERT INTO `fornecedores` (`id_fornecedor`, `razao_social`, `nome_fantasia`, `cnpj`, `telefone_comercial`, `email_faturamento`, `pessoa_contato`) VALUES
(1, 'Papelaria Distribuidora Brasil Ltda', 'Distribuidora Brasil', '12345678000101', '2133334444', 'faturamento@distbrasil.com', 'Roberto Mendes'),
(2, 'Comercial Escolar Ltda', 'Comercial Escolar', '23456789000102', '2122225555', 'financeiro@comercialescolar.com', 'Ana Paula Costa'),
(3, 'Suprimentos Office Ltda', 'Office Suprimentos', '34567890000103', '2144446666', 'faturamento@officesuprimentos.com', 'Marcelo Santos'),
(4, 'Papel & Cia Distribuidora Ltda', 'Papel & Cia', '45678901000104', '2155557777', 'financeiro@papelcia.com', 'Juliana Martins'),
(5, 'Rio Material Escolar Ltda', 'Rio Escolar', '56789012000105', '2166668888', 'faturamento@rioescolar.com', 'Felipe Oliveira');

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos`
--

CREATE TABLE `produtos` (
  `id_produto` int(11) NOT NULL,
  `nome_comercial` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `codigo_barras` char(13) NOT NULL,
  `estoque_atual` int(11) NOT NULL,
  `estoque_minimo` int(11) NOT NULL,
  `valor_compra` decimal(10,2) NOT NULL,
  `valor_venda` decimal(10,2) NOT NULL,
  `unidade_medida` varchar(10) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `produtos`
--

INSERT INTO `produtos` (`id_produto`, `nome_comercial`, `descricao`, `codigo_barras`, `estoque_atual`, `estoque_minimo`, `valor_compra`, `valor_venda`, `unidade_medida`, `status`) VALUES
(1, 'Caderno Universit?rio 10 Mat?rias', 'Caderno espiral capa dura', '7891000000001', 45, 10, '18.50', '29.90', 'UN', 1),
(2, 'Caneta Esferogr?fica Azul', 'Caneta azul ponta m?dia', '7891000000002', 120, 20, '0.80', '1.50', 'UN', 1),
(3, 'L?pis Preto HB', 'L?pis grafite HB para escrita', '7891000000003', 85, 20, '0.45', '0.90', 'UN', 1),
(4, 'Borracha Branca', 'Borracha escolar branca macia', '7891000000004', 60, 15, '0.70', '1.50', 'UN', 1),
(5, 'Papel A4 500 Folhas', 'Papel sulfite branco 75g', '7891000000005', 30, 10, '22.00', '32.90', 'PCT', 1),
(6, 'Marca Texto Amarelo', 'Marca texto fluorescente amarelo', '7891000000006', 40, 10, '1.80', '3.50', 'UN', 1),
(7, 'Cola Bast?o 20g', 'Cola bast?o escolar', '7891000000007', 25, 8, '3.20', '5.90', 'UN', 1),
(8, 'Pasta Pl?stica A4', 'Pasta pl?stica com el?stico', '7891000000008', 18, 5, '2.50', '4.90', 'UN', 1),
(9, 'Grampeador M?dio', 'Grampeador de mesa para escrit?rio', '7891000000009', 12, 5, '12.00', '21.90', 'UN', 1),
(10, 'Tinta para Impressora Preta', 'Cartucho de tinta preta', '7891000000010', 3, 5, '45.00', '69.90', 'UN', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `transacoes`
--

CREATE TABLE `transacoes` (
  `numero_transacao` int(11) NOT NULL,
  `data_hora` datetime NOT NULL,
  `forma_pagamento` varchar(30) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `transacoes`
--

INSERT INTO `transacoes` (`numero_transacao`, `data_hora`, `forma_pagamento`, `valor_total`) VALUES
(1, '2026-09-20 09:10:25', 'Pix', '45.80'),
(2, '2026-09-20 10:22:41', 'Dinheiro', '12.50'),
(3, '2026-09-20 11:05:12', 'Cart?o de D?bito', '78.70'),
(4, '2026-09-20 13:40:08', 'Cart?o de Cr?dito', '125.90'),
(5, '2026-09-20 15:12:33', 'Pix', '32.90'),
(6, '2026-09-21 09:25:17', 'Dinheiro', '18.40'),
(7, '2026-09-21 10:45:29', 'Cart?o de D?bito', '59.80'),
(8, '2026-09-21 14:30:51', 'Pix', '92.50'),
(9, '2026-09-22 11:15:43', 'Cart?o de Cr?dito', '145.70'),
(10, '2026-09-22 16:05:22', 'Pix', '27.90');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Índices para tabela `colaboradores`
--
ALTER TABLE `colaboradores`
  ADD PRIMARY KEY (`matricula`);

--
-- Índices para tabela `fornecedores`
--
ALTER TABLE `fornecedores`
  ADD PRIMARY KEY (`id_fornecedor`);

--
-- Índices para tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id_produto`);

--
-- Índices para tabela `transacoes`
--
ALTER TABLE `transacoes`
  ADD PRIMARY KEY (`numero_transacao`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `fornecedores`
--
ALTER TABLE `fornecedores`
  MODIFY `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `transacoes`
--
ALTER TABLE `transacoes`
  MODIFY `numero_transacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

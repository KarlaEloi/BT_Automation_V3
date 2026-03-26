# BT ONE – Automação de Business Transformation (V3)

## Visão Geral
O BT ONE é um portal de automação de ferramentas de Business Transformation (BT),
desenhado para operar em ambiente **multi-cliente** e **multi-processo**,
com governança, versionamento e reutilização de conhecimento.

A versão V3 representa uma evolução arquitetural,
separando claramente **origem do conhecimento**, **inteligência de interpretação**
e **consumo pelas ferramentas**.

---

## Problema que a V3 resolve
Nas versões anteriores, o JSON utilizado pelas ferramentas era gerado diretamente
por agentes de IA, o que trazia limitações como:

- Forte dependência de UX e prompt manual
- Baixa governança e rastreabilidade
- Dificuldade de versionamento e reprocessamento
- Acoplamento entre geração e consumo de dados

A V3 transforma o JSON em um **ativo estruturado corporativo**.

---

## Princípios Arquiteturais da V3
- Separação entre **Conhecimento**, **Inteligência** e **Consumo**
- Um JSON consolidado por **Cliente + Processo**
- Suporte a múltiplas DTPs para um mesmo processo
- Reprocessamento controlado e versionado
- Ferramentas desacopladas da origem dos dados

---

## Conceitos-Chave

### Base de Conhecimento
A Base de Conhecimento armazena os insumos brutos e os artefatos consolidados
por cliente e processo.

Estrutura padrão:
knowledge_base/
└── Cliente_Processo/
├── dtps/          # Múltiplas DTPs do processo
├── taxonomia/     # Taxonomia Global e LATAM
├── outputs/       # JSON BT ONE consolidado
└── metadata.json  # Governança e versionamento

---

### JSON BT ONE
Para cada **Cliente + Processo** existe **exatamente um JSON BT ONE**,
independente da quantidade de DTPs utilizadas.

Este JSON é:
- A única fonte de dados para todas as ferramentas
- Versionado
- Reprocessável
- Rastreável às DTPs e taxonomias de origem

---

### Engine de Interpretação
O Engine é responsável por:
- Ler DTPs
- Consolidar múltiplas fontes
- Classificar atividades em Taxonomia Global e LATAM
- Gerar o JSON BT ONE conforme schema oficial

O Engine utiliza LLMs apenas como mecanismo de interpretação semântica,
sendo totalmente orquestrado e validado por código Python.

---

### Portal (Camada de Consumo)
O Portal:
- Não interpreta DTPs
- Não chama agentes
- Não gera JSON

Ele apenas **consome o JSON BT ONE** conforme o filtro selecionado
(Cliente + Processo).

Ferramentas como:
- Taxonomia
- SIPOC
- HLPM
- Skill
- FMEA
- Capacity

são desacopladas da origem dos dados.

---

## Estrutura do Projeto (V3)
BT_AUTOMATION_V3/
├── engine/            # Motor de interpretação
├── knowledge_base/    # Base de conhecimento por cliente/processo
├── schemas/           # Contratos oficiais (JSON Schema)
├── scripts/           # Scripts operacionais (processamento/reprocessamento)
├── web_portal/        # Portal (frontend + backend)
├── run_portal.ps1
└── README.md

---

## Fluxo de Alto Nível

1. Upload de DTPs e Taxonomia na Base de Conhecimento
2. Engine processa e consolida as informações
3. Geração do JSON BT ONE
4. Portal consome o JSON conforme Cliente + Processo selecionados

---

## Objetivo da Arquitetura
Garantir que o BT ONE seja:
- Escalável
- Governável
- Reprocessável
- Auditável
- Preparado para múltiplos clientes e processos

---

## Status
✅ Arquitetura V3 criada  
🚧 Engine e schema em evolução  
🚧 Integração completa em desenvolvimento
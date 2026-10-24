# Единая точка запуска sh-скриптов из scripts/ - одинаково на Windows и на Linux (облачные агенты, CI).
#
# Linux/macOS: скрипты запускаются через bash из PATH.
# Windows:     через Git Bash (рядом с установленным git), и только если его нет - через bash из PATH.
#              Системный bash.exe из System32 - это WSL, он намеренно не используется.
#
# Скрипты запускаются в login-режиме (bash -l): так окружение одинаково настраивается профилем
# (/etc/profile, /etc/profile.d - туда scripts/cloud-agent-init кладёт PATH к dotnet), и сами скрипты
# не открывают вложенных login-шеллов.
#
# Использование:
#   make help
#   make agent-check
#   make openspec-version-check
#   make openspec-coverage-check
#
# Переопределить интерпретатор вручную: make SH="C:/Program Files/Git/bin/bash.exe" agent-check

.DEFAULT_GOAL := help

ifeq ($(OS),Windows_NT)
  # git --exec-path -> <GitRoot>/mingw64/libexec/git-core, bash лежит в <GitRoot>/bin/bash.exe
  GIT_EXEC_PATH := $(shell git --exec-path)
  GIT_BASH := $(subst /mingw32/libexec/git-core,/bin/bash.exe,$(subst /mingw64/libexec/git-core,/bin/bash.exe,$(GIT_EXEC_PATH)))
  ifneq ($(findstring bash.exe,$(GIT_BASH)),)
    SH ?= $(GIT_BASH)
  else
    $(warning Git Bash not found via 'git --exec-path'; falling back to 'bash' from PATH)
    SH ?= bash
  endif
else
  # Скрипты используют возможности bash (pipefail, shopt, BASH_SOURCE), поэтому не sh.
  SH ?= bash
endif

RUN = "$(SH)" -l
SPACE :=$(subst ,, )

.PHONY: help agent-check openspec-version-check openspec-coverage-check

# Без sh в PATH make запускает рецепты напрямую (CreateProcess), поэтому echo и прочие
# встроенные команды шелла в рецептах использовать нельзя - только $(info) и $(RUN).
help:
	$(info Targets:)
	$(info $(SPACE)  agent-check              - full pre-PR check: build, all tests, OpenSpec checks)
	$(info $(SPACE)  openspec-version-check   - openspec CLI and generated skills match .openspec-version)
	$(info $(SPACE)  openspec-coverage-check  - every spec scenario is mapped to a test (with the checker's own tests))
	$(info Interpreter: $(SH))
	@$(RUN) -c "exit 0"

agent-check:
	$(RUN) scripts/agent-check/agent-check.sh

openspec-version-check:
	$(RUN) scripts/check-openspec-version/check-openspec-version.sh

openspec-coverage-check:
	$(RUN) scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh

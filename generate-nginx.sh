#!/bin/bash

# Carrega as variáveis do .env
export $(grep -v '^#' .env | xargs)

# Substitui as variáveis no template e gera o nginx.conf
envsubst '$LETSENCRYPT_DOMAIN' < nginx.template.conf > nginx.conf

echo "nginx.conf gerado com sucesso!"

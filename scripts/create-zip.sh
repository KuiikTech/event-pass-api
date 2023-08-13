#!/bin/bash

# Copiar archivos requeridos para el despliegue
cp package.json dist/
cp ecosystem.config.js dist/

# Crear el archivo ZIP
zip -r app-dist.zip dist

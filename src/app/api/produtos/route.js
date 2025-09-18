// src/app/api/produtos/route.js
import { fetchAPI } from '@/lib/api';
import { NextResponse } from 'next/server';

// Função para lidar com requisições GET
export async function GET(request) {
  // Obtém os parâmetros da URL da requisição original
  const { search } = new URL(request.url);

  // Monta o endpoint final para o Strapi
  const strapiEndpoint = `/api/produtos${search}`;

  try {
    // Usa a sua função fetchAPI para chamar o Strapi
    const data = await fetchAPI(strapiEndpoint);
    return NextResponse.json(data);
  } catch (error) {
    // Log do erro no servidor para depuração
    console.error(`Erro ao fazer proxy para Strapi [${strapiEndpoint}]:`, error.message);
    // Retorna uma resposta de erro genérica para o cliente
    return NextResponse.json(
      { message: "Erro ao buscar dados do backend." },
      { status: 500 }
    );
  }
}

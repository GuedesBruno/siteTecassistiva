const fs = require('fs');
const path = require('path');
const https = require('https');
const qs = require('qs');

// 1. Load Env Vars
const envPath = path.resolve(process.cwd(), '.env.local');
let STRAPI_URL = '';
let STRAPI_TOKEN = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            if (key.trim() === 'NEXT_PUBLIC_STRAPI_URL') STRAPI_URL = value.trim();
            if (key.trim() === 'STRAPI_API_TOKEN') STRAPI_TOKEN = value.trim();
        }
    });
} catch (e) {
    console.error('Error reading .env.local', e);
    process.exit(1);
}

if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error('Missing env vars');
    process.exit(1);
}

// Fix URL
STRAPI_URL = STRAPI_URL.replace(/\/+$/, '');

// 2. Construct Query (Mimicking api.js)
const slug = 'everest';
const query = qs.stringify({
    filters: {
        slug: {
            $eq: slug,
        },
    },
    fields: [
        'nome',
        'slug',
        'descricao_curta',
        'descricao_longa',
        'caracteristicas_funcionais',
        'caracteristicas_tecnicas',
        'visao_geral',
        'videos',
    ],
    populate: {
        imagem_principal: { fields: ['url', 'alternativeText', 'width', 'height'] },
        galeria_de_imagens: { fields: ['url', 'alternativeText', 'width', 'height'] },
        subcategorias: { fields: ['nome', 'slug', 'ordem'] },
        categorias: { fields: ['nome', 'slug', 'ordem'] },
        relacao_fabricante: { populate: '*' },
        documentos: { fields: ['url', 'name', 'ext', 'size'] },
        especificacoes_por_categoria: {
            populate: '*',
        },
    },
}, {
    encodeValuesOnly: true,
});

const url = `${STRAPI_URL}/api/produtos?${query}`;

console.log('Fetching:', url);

// 3. Fetch Data
const options = {
    headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        fs.writeFileSync('debug_output.json', data);
        console.log('Data written to debug_output.json');
    });
}).on('error', (e) => {
    console.error('Error fetching', e);
});

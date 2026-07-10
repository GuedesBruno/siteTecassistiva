'use client';

import { useEffect } from 'react';

export default function RedirectPage() {
  useEffect(() => {
    window.location.href = 'https://www.tecassistiva.com.br/ambientes/biblioteca-acessivel/';
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', textAlign: 'center', padding: '2rem' }}>
      <p>
        Redirecionando para a nova página...<br /><br />
        Se não for redirecionado automaticamente,{' '}
        <a 
          href="https://www.tecassistiva.com.br/ambientes/biblioteca-acessivel/" 
          style={{ color: '#0056b3', textDecoration: 'underline' }}
        >
          clique aqui
        </a>.
      </p>
    </div>
  );
}

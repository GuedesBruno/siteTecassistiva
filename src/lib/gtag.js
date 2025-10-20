// src/lib/gtag.js

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  // Verifica se o gtag está disponível (não vai funcionar em ambiente de desenvolvimento se a ID não estiver no .env.local)
  if (typeof window.gtag === 'undefined' || !GA_TRACKING_ID) {
    console.log(`GA Event (dev mode): ${action}, Category: ${category}, Label: ${label}`);
    return;
  }
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
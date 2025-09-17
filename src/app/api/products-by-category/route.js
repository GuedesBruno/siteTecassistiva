import { NextResponse } from 'next/server';
import { getProductsByCategorySlug } from '@/lib/api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ data: [], error: 'missing slug' }, { status: 400 });

    const products = await getProductsByCategorySlug(slug);
    return NextResponse.json({ data: products });
  } catch (err) {
    console.error('API products-by-category failed:', err.message);
    return NextResponse.json({ data: [], error: err.message }, { status: 500 });
  }
}

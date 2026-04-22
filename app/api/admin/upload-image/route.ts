import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function isServiceRoleKey(key: string): boolean {
  if (key.startsWith('sb_secret_')) return true;
  if (key.startsWith('sb_publishable_')) return false;

  // Legacy JWT-style keys: read role claim.
  const parts = key.split('.');
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8')) as {
        role?: string;
      };
      return payload.role === 'service_role';
    } catch {
      return false;
    }
  }

  return false;
}

function buildStoragePath(fileName: string): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  return `products/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('broly_admin_session')?.value;

    if (adminSession !== 'active') {
      return NextResponse.json(
        { error: 'Admin session is required for uploads.' },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'Product';

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Add URL and service key in environment.' },
        { status: 500 }
      );
    }

    if (!isServiceRoleKey(serviceRoleKey)) {
      return NextResponse.json(
        {
          error:
            'SUPABASE_SERVICE_ROLE_KEY is invalid. Use the service role (or sb_secret_*) key from Supabase Settings > API Keys.',
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'Image is too large. Max allowed size is 8MB.' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const path = buildStoragePath(file.name || 'image');

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Supabase upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ url: publicUrl, path });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected upload error.' },
      { status: 500 }
    );
  }
}

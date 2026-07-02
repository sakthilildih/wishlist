import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, topic } = body;

    // Server-side validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'invalid_email', message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!topic || typeof topic !== 'string' || topic === '' || topic === 'Pick a topic...') {
      return NextResponse.json(
        { success: false, error: 'invalid_topic', message: 'Please select a valid topic.' },
        { status: 400 }
      );
    }

    // Insert into Supabase using admin client (bypasses RLS to write waitlist)
    const { error } = await supabaseAdmin
      .from('waitlist')
      .insert([
        {
          email: email.trim().toLowerCase(),
          topic: topic.trim(),
          source: 'waitlist_page',
        },
      ]);

    if (error) {
      // Postgres error code 23505 represents unique_violation
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'already_registered' });
      }
      
      console.error('Supabase DB Insert Error:', error);
      return NextResponse.json(
        { success: false, error: 'db_insert_failed', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Waitlist API Server Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: 'server_error', message: errorMessage },
      { status: 500 }
    );
  }
}

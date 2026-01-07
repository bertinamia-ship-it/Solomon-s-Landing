/**
 * Netlify Function: Get All Tables
 * Returns all active tables grouped by area for floor plan display
 */

const { createClient } = require('@supabase/supabase-js');

const json = (statusCode, data) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
});

exports.handler = async (event, context) => {
    // Handle CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'GET') {
        return json(405, { ok: false, error: 'Method not allowed' });
    }

    try {
        if (!process.env.SUPABASE_URL) {
            return json(500, { ok: false, error: 'Missing SUPABASE_URL' });
        }
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY) {
            return json(500, { ok: false, error: 'Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY' });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: tables, error } = await supabase
            .from('tables')
            .select('*')
            .eq('is_active', true)
            .order('area', { ascending: true })
            .order('table_number', { ascending: true });

        if (error) {
            throw error;
        }

        // Group by area
        const grouped = {};
        (tables || []).forEach(table => {
            if (!grouped[table.area]) {
                grouped[table.area] = [];
            }
            grouped[table.area].push(table);
        });

        return json(200, { ok: true, success: true, tables: grouped, all: tables || [] });

    } catch (err) {
        console.error('FUNCTION ERROR:', err);
        return json(500, {
            ok: false,
            error: String(err?.message || err),
            stack: err?.stack || null
        });
    }
};


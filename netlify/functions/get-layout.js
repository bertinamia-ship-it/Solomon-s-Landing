/**
 * Netlify Function: Get Floor Plan Layout
 * Returns layout_json for a specific area
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
    // CORS handling
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

        const area = event.queryStringParameters?.area;
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        const supabase = createClient(supabaseUrl, supabaseKey);

        if (area) {
            // Get layout for specific area
            const { data: layout, error } = await supabase
                .from('table_layout')
                .select('*')
                .eq('area', area)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = not found
                throw error;
            }

            return json(200, {
                ok: true,
                success: true,
                layout: layout || { area, layout_json: [] }
            });
        } else {
            // Get all layouts
            const { data: layouts, error } = await supabase
                .from('table_layout')
                .select('*')
                .order('area', { ascending: true });

            if (error) throw error;

            return json(200, {
                ok: true,
                success: true,
                layouts: layouts || []
            });
        }

    } catch (err) {
        console.error('FUNCTION ERROR:', err);
        return json(500, {
            ok: false,
            error: String(err?.message || err),
            stack: err?.stack || null
        });
    }
};


/**
 * Netlify Function: Upsert Table (Create or Update)
 * Admin function to create or update a table
 */

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
    // CORS handling
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }

    // Simple auth check (in production, use proper JWT)
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
        return {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, error: 'Unauthorized' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { id, table_number, name, area, seats, is_active, notes } = data;

        // Validate required fields
        if (!table_number || !area || !seats) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Missing required fields: table_number, area, seats' })
            };
        }

        // Validate seats (must be 2, 4, or 6)
        if (![2, 4, 6].includes(parseInt(seats))) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Seats must be 2, 4, or 6' })
            };
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Server configuration error' })
            };
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const tableData = {
            table_number: parseInt(table_number),
            name: name || null,
            area: area,
            seats: parseInt(seats),
            is_active: is_active !== undefined ? is_active : true,
            notes: notes || null
        };

        let result;
        if (id) {
            // Update existing table
            const { data: updated, error } = await supabase
                .from('tables')
                .update(tableData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            result = updated;
        } else {
            // Insert new table
            const { data: inserted, error } = await supabase
                .from('tables')
                .insert([tableData])
                .select()
                .single();

            if (error) throw error;
            result = inserted;
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, table: result })
        };

    } catch (error) {
        console.error('❌ Error upserting table:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, error: error.message || 'Internal server error' })
        };
    }
};


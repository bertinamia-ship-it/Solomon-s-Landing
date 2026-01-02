/**
 * Netlify Function: Get Table Assignments by Date
 * Hostess dashboard function to fetch table assignments for a specific date
 */

const { createClient } = require('@supabase/supabase-js');

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
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }

    try {
        const date = event.queryStringParameters?.date;
        if (!date) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Date parameter required' })
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

        // Get assignments for this date (datetime_iso starts with date)
        const { data: assignments, error } = await supabase
            .from('table_assignments')
            .select(`
                *,
                tables!inner(table_number, capacity),
                reservations(name, party_size)
            `)
            .like('datetime_iso', `${date}%`)
            .eq('status', 'active')
            .order('datetime_iso', { ascending: true });

        if (error) {
            throw error;
        }

        // Format response with table numbers
        const formatted = (assignments || []).map(a => ({
            ...a,
            table_number: a.tables?.table_number,
            capacity: a.tables?.capacity,
            reservation_name: a.reservations?.name,
            reservation_party_size: a.reservations?.party_size
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formatted)
        };

    } catch (error) {
        console.error('Error fetching table assignments:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};


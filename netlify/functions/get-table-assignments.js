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

        const time = event.queryStringParameters?.time; // Optional: filter by time slot
        const tableId = event.queryStringParameters?.table_id; // Optional: filter by table ID

        // Build query
        let query = supabase
            .from('table_assignments')
            .select(`
                *,
                tables!inner(name, table_number, area, seats),
                reservations(name, full_name, party_size, status, confirmation_code)
            `)
            .eq('date', date)
            .in('status', ['reserved', 'blocked', 'unavailable'])
            .order('time', { ascending: true });

        if (time) {
            query = query.eq('time', time);
        }

        if (tableId) {
            query = query.eq('table_id', tableId);
        }

        const { data: assignments, error } = await query;

        if (error) {
            throw error;
        }

        // Format response with table details
        const formatted = (assignments || []).map(a => ({
            ...a,
            table_name: a.tables?.name,
            table_number: a.tables?.table_number,
            table_area: a.tables?.area,
            seats: a.tables?.seats || a.tables?.capacity, // Support both 'seats' and 'capacity'
            reservation_name: a.reservations?.name || a.reservations?.full_name,
            reservation_party_size: a.reservations?.party_size,
            reservation_status: a.reservations?.status,
            reservation_code: a.reservations?.confirmation_code
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ ok: true, success: true, assignments: formatted })
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


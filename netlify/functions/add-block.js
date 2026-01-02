/**
 * Netlify Function: Add Manual Block (OpenTable)
 * Admin dashboard function to add blocked slots
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

    try {
        const data = JSON.parse(event.body);

        // Validate required fields
        if (!data.date || !data.time || !data.seats_blocked) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Missing required fields: date, time, seats_blocked' })
            };
        }

        // Validate date format
        if (!data.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Invalid date format' })
            };
        }

        // Validate time format
        const VALID_TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
        if (!data.time.match(/^\d{2}:\d{2}$/) || !VALID_TIMES.includes(data.time)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Invalid time' })
            };
        }

        const seatsBlocked = parseInt(data.seats_blocked);
        if (!seatsBlocked || seatsBlocked < 1 || seatsBlocked > 106) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Invalid seats_blocked (must be 1-106)' })
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

        // Apply block to all 3 slots in the 90-min window
        const timeIndex = VALID_TIMES.indexOf(data.time);
        const blocksToInsert = [];
        
        for (let i = 0; i < 3 && (timeIndex + i) < VALID_TIMES.length; i++) {
            blocksToInsert.push({
                date: data.date,
                time: VALID_TIMES[timeIndex + i],
                seats_blocked: seatsBlocked,
                reason: data.reason || 'OpenTable',
                is_permanent: false
            });
        }

        const { data: inserted, error } = await supabase
            .from('blocked_slots')
            .insert(blocksToInsert)
            .select();

        if (error) {
            throw error;
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, blocks: inserted })
        };

    } catch (error) {
        console.error('Error adding block:', error);
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


/**
 * Netlify Function: Get Available Times
 * 
 * Returns list of available reservation times for a given date, party size, and area.
 * Uses 3-slot system (T, T+30, T+60) to respect 90-minute reservation window.
 * 
 * Input: { date, party_size, area, open_time, close_time, interval_minutes=30 }
 * Output: { ok:true, times:["17:00","17:30",...] }
 * 
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js');

// Valid reservation times (30-minute intervals)
const VALID_TIMES = [
    '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30'
];

// Helper: Calculate T+30 and T+60 for a given time
function getThreeSlots(time) {
    const timeIndex = VALID_TIMES.indexOf(time);
    if (timeIndex === -1) return [];
    
    const slots = [];
    for (let i = 0; i < 3 && (timeIndex + i) < VALID_TIMES.length; i++) {
        slots.push(VALID_TIMES[timeIndex + i]);
    }
    return slots;
}

// Helper: Find best table combination for party size (same logic as find-available-tables)
function findTableCombination(partySize, availableTables) {
    // Prefer exact fit
    const exactFit = availableTables.find(t => t.seats === partySize);
    if (exactFit) {
        return [{ table_id: exactFit.id, seats: exactFit.seats }];
    }

    // Try combinations for larger parties
    if (partySize <= 4) {
        // Try 2 tables of 2
        const tables2 = availableTables.filter(t => t.seats === 2).slice(0, 2);
        if (tables2.length === 2 && tables2[0].seats * 2 >= partySize) {
            return tables2.map(t => ({ table_id: t.id, seats: t.seats }));
        }
    }

    if (partySize <= 6) {
        // Try 1 table of 6
        const table6 = availableTables.find(t => t.seats === 6);
        if (table6) {
            return [{ table_id: table6.id, seats: table6.seats }];
        }
        // Try 1 table of 4 + 1 table of 2
        const table4 = availableTables.find(t => t.seats === 4);
        const table2 = availableTables.find(t => t.seats === 2);
        if (table4 && table2 && table4.seats + table2.seats >= partySize) {
            return [
                { table_id: table4.id, seats: table4.seats },
                { table_id: table2.id, seats: table2.seats }
            ];
        }
    }

    if (partySize <= 8) {
        // Try 2 tables of 4
        const tables4 = availableTables.filter(t => t.seats === 4).slice(0, 2);
        if (tables4.length === 2) {
            return tables4.map(t => ({ table_id: t.id, seats: t.seats }));
        }
    }

    if (partySize <= 10) {
        // Try 1 table of 6 + 1 table of 4
        const table6 = availableTables.find(t => t.seats === 6);
        const table4 = availableTables.find(t => t.seats === 4);
        if (table6 && table4) {
            return [
                { table_id: table6.id, seats: table6.seats },
                { table_id: table4.id, seats: table4.seats }
            ];
        }
    }

    if (partySize <= 12) {
        // Try 2 tables of 6
        const tables6 = availableTables.filter(t => t.seats === 6).slice(0, 2);
        if (tables6.length === 2) {
            return tables6.map(t => ({ table_id: t.id, seats: t.seats }));
        }
    }

    // For larger parties, use multiple tables of 4
    const tables4 = availableTables.filter(t => t.seats === 4);
    const needed = Math.ceil(partySize / 4);
    if (tables4.length >= needed) {
        return tables4.slice(0, needed).map(t => ({ table_id: t.id, seats: t.seats }));
    }

    return null;
}

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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
        return json(405, { ok: false, error: 'Method not allowed' });
    }

    try {
        // Parse input (GET from query params, POST from body)
        let data;
        if (event.httpMethod === 'GET') {
            data = {
                date: event.queryStringParameters?.date,
                party_size: event.queryStringParameters?.party_size,
                area: event.queryStringParameters?.area || 'Main Floor',
                open_time: event.queryStringParameters?.open_time || '17:30',
                close_time: event.queryStringParameters?.close_time || '21:30',
                interval_minutes: parseInt(event.queryStringParameters?.interval_minutes || '30')
            };
        } else {
            data = JSON.parse(event.body);
        }

        // Validate required fields
        if (!data.date || !data.party_size) {
            return json(400, {
                ok: false,
                error: 'Missing required fields: date, party_size'
            });
        }

        const partySize = parseInt(data.party_size);
        if (!partySize || partySize < 1) {
            return json(400, {
                ok: false,
                error: 'Invalid party_size (must be >= 1)'
            });
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.date)) {
            return json(400, {
                ok: false,
                error: 'Invalid date format (use YYYY-MM-DD)'
            });
        }

        // Validate date is today or future
        const reservationDate = new Date(data.date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (reservationDate < today) {
            return json(400, {
                ok: false,
                error: 'Date must be today or in the future'
            });
        }

        // Get environment variables
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return json(500, {
                ok: false,
                error: 'Server configuration error'
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get all active tables for the specified area
        const { data: allTables, error: tablesError } = await supabase
            .from('tables')
            .select('id, table_number, seats, area')
            .eq('is_active', true)
            .eq('area', data.area || 'Main Floor')
            .order('seats', { ascending: true });

        if (tablesError) {
            throw tablesError;
        }

        if (!allTables || allTables.length === 0) {
            return json(200, {
                ok: true,
                times: [],
                message: `No tables configured for area: ${data.area || 'Main Floor'}`
            });
        }

        // Check max table capacity
        const maxCapacity = Math.max(...allTables.map(t => t.seats));
        if (partySize > maxCapacity * 2) {
            // If party size is more than double the max single table, suggest calling
            return json(200, {
                ok: true,
                times: [],
                message: `Party size (${partySize}) exceeds maximum capacity. Please call the restaurant for large party reservations.`,
                max_capacity: maxCapacity,
                suggestion: 'call_restaurant'
            });
        }

        // Filter candidate times based on open_time and close_time
        const openTime = data.open_time || '17:30';
        const closeTime = data.close_time || '21:30';
        const candidateTimes = VALID_TIMES.filter(t => t >= openTime && t <= closeTime);

        if (candidateTimes.length === 0) {
            return json(200, {
                ok: true,
                times: [],
                message: 'No valid times in the specified range'
            });
        }

        // Get all table assignments for this date (all times)
        const { data: allAssignments, error: assignmentsError } = await supabase
            .from('table_assignments')
            .select('table_id, time, status')
            .eq('date', data.date)
            .in('status', ['reserved', 'blocked', 'unavailable']);

        if (assignmentsError) {
            throw assignmentsError;
        }

        // Build map of occupied tables by time slot
        const occupiedByTime = {};
        if (allAssignments) {
            allAssignments.forEach(assignment => {
                if (!occupiedByTime[assignment.time]) {
                    occupiedByTime[assignment.time] = new Set();
                }
                occupiedByTime[assignment.time].add(assignment.table_id);
            });
        }

        // Check each candidate time
        const availableTimes = [];

        for (const candidateTime of candidateTimes) {
            // Get the 3 slots for this time (T, T+30, T+60)
            const threeSlots = getThreeSlots(candidateTime);
            
            if (threeSlots.length < 3) {
                // Time is too close to closing, skip
                continue;
            }

            // Get all tables that are NOT occupied in ANY of the 3 slots
            const occupiedInAnySlot = new Set();
            threeSlots.forEach(slotTime => {
                if (occupiedByTime[slotTime]) {
                    occupiedByTime[slotTime].forEach(tableId => {
                        occupiedInAnySlot.add(tableId);
                    });
                }
            });

            // Filter available tables (not occupied in any of the 3 slots)
            const availableTables = allTables.filter(t => !occupiedInAnySlot.has(t.id));

            // Check if we can seat this party size with available tables
            const tableCombination = findTableCombination(partySize, availableTables);

            if (tableCombination && tableCombination.length > 0) {
                availableTimes.push(candidateTime);
            }
        }

        return json(200, {
            ok: true,
            times: availableTimes,
            date: data.date,
            party_size: partySize,
            area: data.area || 'Main Floor',
            total_tables: allTables.length,
            message: availableTimes.length > 0
                ? `Found ${availableTimes.length} available time(s)`
                : 'No available times for this party size and date'
        });

    } catch (err) {
        console.error('FUNCTION ERROR:', err);
        return json(500, {
            ok: false,
            error: String(err?.message || err),
            stack: err?.stack || null
        });
    }
};


/**
 * Netlify Function: Check Reservation Availability
 * 
 * Checks if seats are available for a reservation time slot.
 * Reservation window: 90 minutes (occupies 3 consecutive 30-min slots)
 * 
 * Table inventory:
 * - 17 tables of 4 = 68 seats
 * - 6 tables of 6 = 36 seats
 * - 1 table of 2 = 2 seats
 * Total: 106 seats
 * 
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js');

// Table inventory constants
const TOTAL_SEATS = 106;
const RESERVATION_WINDOW_SLOTS = 3; // 90 minutes = 3 slots of 30 min

// Valid reservation times (5:30 PM to 9:30 PM, every 30 min)
const VALID_TIMES = [
    '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30'
];

// Helper: Get the 3 slots occupied by a reservation
function getOccupiedSlots(time) {
    const timeIndex = VALID_TIMES.indexOf(time);
    if (timeIndex === -1) return [];
    
    const slots = [];
    for (let i = 0; i < RESERVATION_WINDOW_SLOTS && (timeIndex + i) < VALID_TIMES.length; i++) {
        slots.push(VALID_TIMES[timeIndex + i]);
    }
    return slots;
}

// Helper: Calculate seats needed for party size
function calculateSeatsNeeded(partySize) {
    // Round up to nearest table size
    if (partySize <= 2) return 2;
    if (partySize <= 4) return 4;
    if (partySize <= 6) return 6;
    // For larger parties, use multiple tables
    // 7-8: 2 tables of 4 = 8 seats
    // 9-10: 2 tables of 6 = 12 seats (or 1x6 + 1x4 = 10)
    // 11-12: 2 tables of 6 = 12 seats
    // 13-14: 3 tables of 4 + 1 table of 6 = 18 seats (or 2x6 + 1x4 = 16)
    // For simplicity, use: ceil(partySize / 4) * 4, but cap at reasonable max
    if (partySize <= 8) return 8;
    if (partySize <= 10) return 10;
    if (partySize <= 12) return 12;
    // For very large parties, use multiple tables
    return Math.ceil(partySize / 4) * 4;
}

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ 
                success: false, 
                error: 'Method not allowed. Use POST.' 
            })
        };
    }

    // Handle CORS preflight
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

    try {
        // Parse request body
        const data = JSON.parse(event.body);

        // Validate required fields
        if (!data.date || !data.time || !data.party_size) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Missing required fields: date, time, party_size' 
                })
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
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Invalid date format. Expected YYYY-MM-DD' 
                })
            };
        }

        // Validate time format and is valid reservation time
        if (!data.time.match(/^\d{2}:\d{2}$/) || !VALID_TIMES.includes(data.time)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: `Invalid time. Must be one of: ${VALID_TIMES.join(', ')}` 
                })
            };
        }

        const partySize = parseInt(data.party_size);
        if (!partySize || partySize < 1) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Invalid party size' 
                })
            };
        }

        // Get environment variables
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Supabase configuration missing');
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Server configuration error' 
                })
            };
        }

        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get occupied slots for this reservation
        const occupiedSlots = getOccupiedSlots(data.time);
        if (occupiedSlots.length === 0) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Invalid reservation time' 
                })
            };
        }

        // Calculate seats needed
        const seatsNeeded = calculateSeatsNeeded(partySize);

        // Use new table-based availability check
        // Build datetime_iso from date and time
        const datetimeIso = `${data.date}T${data.time}:00`;
        
        // Call find-available-tables function logic inline
        const RESERVATION_DURATION_MINUTES = 90;
        function getEndDatetime(datetimeIso) {
            const start = new Date(datetimeIso);
            const end = new Date(start.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000);
            return end.toISOString().slice(0, 16).replace('T', 'T');
        }

        const endDatetime = getEndDatetime(datetimeIso);

        // Get all active tables
        const { data: allTables, error: tablesError } = await supabase
            .from('tables')
            .select('id, table_number, capacity')
            .eq('is_active', true);

        if (tablesError) {
            throw tablesError;
        }

        // Get tables that are already assigned during this time window
        const { data: assignments, error: assignmentsError } = await supabase
            .from('table_assignments')
            .select('table_id, datetime_iso')
            .eq('status', 'active')
            .gte('datetime_iso', datetimeIso)
            .lt('datetime_iso', endDatetime);

        if (assignmentsError) {
            throw assignmentsError;
        }

        // Get list of occupied table IDs
        const occupiedTableIds = new Set();
        if (assignments) {
            assignments.forEach(assignment => {
                const assignmentStart = new Date(assignment.datetime_iso);
                const assignmentEnd = new Date(assignmentStart.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000);
                const ourStart = new Date(datetimeIso);
                const ourEnd = new Date(endDatetime);
                if (assignmentStart < ourEnd && assignmentEnd > ourStart) {
                    occupiedTableIds.add(assignment.table_id);
                }
            });
        }

        // Filter out occupied tables
        const availableTables = (allTables || []).filter(t => !occupiedTableIds.has(t.id));
        const totalAvailableCapacity = availableTables.reduce((sum, t) => sum + t.capacity, 0);

        // Check if we have enough capacity
        const allAvailable = totalAvailableCapacity >= seatsNeeded;

        // Also check blocked_slots for backward compatibility
        let seatsBlocked = 0;
        for (const slotTime of occupiedSlots) {
            const { data: blocks } = await supabase
                .from('blocked_slots')
                .select('seats_blocked')
                .eq('date', data.date)
                .eq('time', slotTime);

            if (blocks) {
                blocks.forEach(block => {
                    seatsBlocked += block.seats_blocked || 0;
                });
            }
        }

        const finalAvailableCapacity = totalAvailableCapacity - seatsBlocked;
        const allAvailableFinal = finalAvailableCapacity >= seatsNeeded;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                available: allAvailable,
                seats_needed: seatsNeeded,
                slots: availabilityResults,
                message: allAvailable 
                    ? 'Seats available' 
                    : 'Not enough seats available for this time slot'
            })
        };

    } catch (error) {
        console.error('❌ Error checking availability:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: error.message || 'Failed to check availability' 
            })
        };
    }
};


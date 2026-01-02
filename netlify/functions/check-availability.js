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

        // Try to get tables from Supabase, fall back to hardcoded inventory if table doesn't exist
        let allTables = null;
        let tablesError = null;
        
        try {
            const tablesResult = await supabase
                .from('tables')
                .select('id, table_number, seats')
                .eq('is_active', true);
            
            allTables = tablesResult.data;
            tablesError = tablesResult.error;
        } catch (err) {
            tablesError = err;
        }

        // If tables table doesn't exist, use hardcoded inventory
        if (tablesError && (tablesError.message?.includes('schema cache') || tablesError.message?.includes('does not exist'))) {
            console.warn('⚠️ Tables table not found, using hardcoded inventory');
            // Hardcoded inventory: 17 tables of 4, 6 tables of 6, 1 table of 2
            allTables = [
                ...Array.from({ length: 17 }, (_, i) => ({ id: `hardcoded-${i + 1}`, table_number: i + 1, seats: 4 })),
                ...Array.from({ length: 6 }, (_, i) => ({ id: `hardcoded-${i + 18}`, table_number: i + 18, seats: 6 })),
                { id: 'hardcoded-24', table_number: 24, seats: 2 }
            ];
        } else if (tablesError) {
            throw tablesError;
        }

        // Get tables that are already assigned during this time window (only if table_assignments exists)
        let occupiedTableIds = new Set();
        try {
            const { data: assignments, error: assignmentsError } = await supabase
                .from('table_assignments')
                .select('table_id, datetime_iso, duration_minutes')
                .in('status', ['reserved', 'blocked', 'unavailable'])
                .lte('datetime_iso', endDatetime)
                .gte('datetime_iso', datetimeIso);

            if (!assignmentsError && assignments) {
                assignments.forEach(assignment => {
                    const assignmentStart = new Date(assignment.datetime_iso);
                    const assignmentEnd = new Date(assignmentStart.getTime() + (assignment.duration_minutes || RESERVATION_DURATION_MINUTES) * 60 * 1000);
                    const ourStart = new Date(datetimeIso);
                    const ourEnd = new Date(endDatetime);
                    if (assignmentStart < ourEnd && assignmentEnd > ourStart) {
                        occupiedTableIds.add(assignment.table_id);
                    }
                });
            }
        } catch (err) {
            // If table_assignments doesn't exist, just continue without it
            console.warn('⚠️ table_assignments table not found, skipping table-level checks');
        }

        // Filter out occupied tables
        const availableTables = (allTables || []).filter(t => !occupiedTableIds.has(t.id));

        // Greedy allocation algorithm: try to find suitable table combination
        function greedyAllocate(partySize, tables) {
            // Sort tables by seats (ascending)
            const sorted = [...tables].sort((a, b) => (a.seats || a.capacity) - (b.seats || b.capacity));
            
            // Try exact fit first
            const exactFit = sorted.find(t => (t.seats || t.capacity) === partySize);
            if (exactFit) return true;

            // For small parties (1-2), try 2-top or 4-top
            if (partySize <= 2) {
                const table2 = sorted.find(t => (t.seats || t.capacity) === 2);
                if (table2) return true;
                const table4 = sorted.find(t => (t.seats || t.capacity) === 4);
                if (table4) return true;
            }

            // For 3-4, try 4-top
            if (partySize <= 4) {
                const table4 = sorted.find(t => (t.seats || t.capacity) === 4);
                if (table4) return true;
            }

            // For 5-6, try 6-top
            if (partySize <= 6) {
                const table6 = sorted.find(t => (t.seats || t.capacity) === 6);
                if (table6) return true;
            }

            // For larger parties, try combinations
            let remaining = partySize;
            const used = new Set();
            
            // Greedy: use largest tables first
            const sortedDesc = [...sorted].sort((a, b) => (b.seats || b.capacity) - (a.seats || a.capacity));
            
            for (const table of sortedDesc) {
                if (used.has(table.id)) continue;
                const seats = table.seats || table.capacity;
                if (seats >= remaining) {
                    return true; // Found a table that fits
                }
                // Try combining tables
                remaining -= seats;
                used.add(table.id);
                if (remaining <= 0) return true;
            }

            return false; // No suitable combination found
        }

        // Check availability using greedy allocation
        const allAvailable = greedyAllocate(seatsNeeded, availableTables);
        const totalAvailableCapacity = availableTables.reduce((sum, t) => sum + (t.seats || t.capacity || 0), 0);

        // Also check blocked_slots for backward compatibility
        let seatsBlocked = 0;
        try {
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
        } catch (err) {
            // If blocked_slots doesn't exist, just continue without it
            console.warn('⚠️ blocked_slots table not found, skipping block checks');
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
                available: allAvailableFinal,
                seats_needed: seatsNeeded,
                available_capacity: finalAvailableCapacity,
                message: allAvailableFinal 
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


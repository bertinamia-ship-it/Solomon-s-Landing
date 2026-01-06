/**
 * Netlify Function: Find Available Tables
 * 
 * Finds available table(s) for a reservation based on party size and datetime.
 * Prefers exact fit (2, 4, 6) but can combine tables for larger parties.
 * 
 * Environment Variables Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js');

// Reservation window: 90 minutes
const RESERVATION_DURATION_MINUTES = 90;

// Helper: Calculate end datetime from start datetime
function getEndDatetime(datetimeIso) {
    const start = new Date(datetimeIso);
    const end = new Date(start.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000);
    return end.toISOString().slice(0, 16).replace('T', 'T');
}

// Helper: Find best table combination for party size
function findTableCombination(partySize, availableTables) {
    // Prefer exact fit
    const exactFit = availableTables.find(t => t.capacity === partySize);
    if (exactFit) {
        return [{ table_id: exactFit.id, table_number: exactFit.table_number, capacity: exactFit.capacity }];
    }

    // Try combinations for larger parties
    if (partySize <= 4) {
        // Try 2 tables of 2
        const tables2 = availableTables.filter(t => t.capacity === 2).slice(0, 2);
        if (tables2.length === 2 && tables2[0].capacity * 2 >= partySize) {
            return tables2.map(t => ({ table_id: t.id, table_number: t.table_number, capacity: t.capacity }));
        }
    }

    if (partySize <= 6) {
        // Try 1 table of 6
        const table6 = availableTables.find(t => t.capacity === 6);
        if (table6) {
            return [{ table_id: table6.id, table_number: table6.table_number, capacity: table6.capacity }];
        }
        // Try 1 table of 4 + 1 table of 2
        const table4 = availableTables.find(t => t.capacity === 4);
        const table2 = availableTables.find(t => t.capacity === 2);
        if (table4 && table2 && table4.capacity + table2.capacity >= partySize) {
            return [
                { table_id: table4.id, table_number: table4.table_number, capacity: table4.capacity },
                { table_id: table2.id, table_number: table2.table_number, capacity: table2.capacity }
            ];
        }
    }

    if (partySize <= 8) {
        // Try 2 tables of 4
        const tables4 = availableTables.filter(t => t.capacity === 4).slice(0, 2);
        if (tables4.length === 2) {
            return tables4.map(t => ({ table_id: t.id, table_number: t.table_number, capacity: t.capacity }));
        }
    }

    if (partySize <= 10) {
        // Try 1 table of 6 + 1 table of 4
        const table6 = availableTables.find(t => t.capacity === 6);
        const table4 = availableTables.find(t => t.capacity === 4);
        if (table6 && table4) {
            return [
                { table_id: table6.id, table_number: table6.table_number, capacity: table6.capacity },
                { table_id: table4.id, table_number: table4.table_number, capacity: table4.capacity }
            ];
        }
    }

    if (partySize <= 12) {
        // Try 2 tables of 6
        const tables6 = availableTables.filter(t => t.capacity === 6).slice(0, 2);
        if (tables6.length === 2) {
            return tables6.map(t => ({ table_id: t.id, table_number: t.table_number, capacity: t.capacity }));
        }
    }

    // For larger parties, use multiple tables of 4
    const tables4 = availableTables.filter(t => t.capacity === 4);
    const needed = Math.ceil(partySize / 4);
    if (tables4.length >= needed) {
        return tables4.slice(0, needed).map(t => ({ table_id: t.id, table_number: t.table_number, capacity: t.capacity }));
    }

    return null;
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
        if (!data.datetime_iso || !data.party_size) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Missing required fields: datetime_iso, party_size' 
                })
            };
        }

        // Validate datetime_iso format
        const startDatetime = new Date(data.datetime_iso);
        if (Number.isNaN(startDatetime.getTime())) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Invalid datetime_iso format' 
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

        // Calculate reservation time window
        const endDatetime = getEndDatetime(data.datetime_iso);

        // Get all active tables
        const { data: allTables, error: tablesError } = await supabase
            .from('tables')
            .select('id, table_number, capacity')
            .eq('is_active', true)
            .order('capacity', { ascending: true });

        if (tablesError) {
            throw tablesError;
        }

        if (!allTables || allTables.length === 0) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'No active tables configured' 
                })
            };
        }

        // Get tables that are already assigned during this time window
        const { data: assignments, error: assignmentsError } = await supabase
            .from('table_assignments')
            .select('table_id, datetime_iso')
            .in('status', ['reserved', 'blocked', 'unavailable'])
            .gte('datetime_iso', data.datetime_iso)
            .lt('datetime_iso', endDatetime);

        if (assignmentsError) {
            throw assignmentsError;
        }

        // Get list of occupied table IDs
        const occupiedTableIds = new Set();
        if (assignments) {
            assignments.forEach(assignment => {
                // Check if assignment overlaps with our reservation window
                const assignmentStart = new Date(assignment.datetime_iso);
                const assignmentEnd = new Date(assignmentStart.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000);
                const ourStart = new Date(data.datetime_iso);
                const ourEnd = new Date(endDatetime);

                // Check for overlap
                if (assignmentStart < ourEnd && assignmentEnd > ourStart) {
                    occupiedTableIds.add(assignment.table_id);
                }
            });
        }

        // Filter out occupied tables
        const availableTables = allTables.filter(t => !occupiedTableIds.has(t.id));

        // Find best table combination
        const tableCombination = findTableCombination(partySize, availableTables);

        if (!tableCombination) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: true,
                    available: false,
                    message: 'No available tables for this party size and time',
                    party_size: partySize,
                    total_capacity_available: availableTables.reduce((sum, t) => sum + t.capacity, 0)
                })
            };
        }

        const totalCapacity = tableCombination.reduce((sum, t) => sum + t.capacity, 0);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                available: true,
                tables: tableCombination,
                total_capacity: totalCapacity,
                party_size: partySize,
                message: `Found ${tableCombination.length} table(s) for ${partySize} guests`
            })
        };

    } catch (error) {
        console.error('❌ Error finding available tables:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: error.message || 'Failed to find available tables' 
            })
        };
    }
};


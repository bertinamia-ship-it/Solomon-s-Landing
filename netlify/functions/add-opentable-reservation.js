/**
 * Netlify Function: Add OpenTable Reservation
 * Quick add form for OpenTable reservations with table assignment
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
        if (!data.date || !data.time || !data.party_size) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'Missing required fields: date, time, party_size' })
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

        // Build datetime_iso
        const datetimeIso = `${data.date}T${data.time}:00`;

        // If table_ids provided, use them; otherwise find available tables
        let tableAssignments = [];
        if (data.table_ids && data.table_ids.length > 0) {
            // Get table details
            const { data: tables } = await supabase
                .from('tables')
                .select('id, name, table_number, area, capacity')
                .in('id', data.table_ids)
                .eq('is_active', true);

            if (tables) {
                tableAssignments = tables.map(t => ({
                    table_id: t.id,
                    name: t.name,
                    table_number: t.table_number,
                    area: t.area,
                    capacity: t.capacity
                }));
            }
        } else {
            // Auto-assign tables using find-available-tables logic
            const RESERVATION_DURATION_MINUTES = 90;
            function getEndDatetime(dt) {
                const start = new Date(dt);
                const end = new Date(start.getTime() + RESERVATION_DURATION_MINUTES * 60 * 1000);
                return end.toISOString().slice(0, 16).replace('T', 'T');
            }

            function findTableCombination(partySize, availableTables) {
                if (partySize <= 2) {
                    const table2 = availableTables.find(t => t.capacity === 2);
                    if (table2) return [{ table_id: table2.id, name: table2.name, table_number: table2.table_number, area: table2.area, capacity: table2.capacity }];
                }
                if (partySize <= 4) {
                    const table4 = availableTables.find(t => t.capacity === 4);
                    if (table4) return [{ table_id: table4.id, name: table4.name, table_number: table4.table_number, area: table4.area, capacity: table4.capacity }];
                }
                if (partySize <= 6) {
                    const table6 = availableTables.find(t => t.capacity === 6);
                    if (table6) return [{ table_id: table6.id, name: table6.name, table_number: table6.table_number, area: table6.area, capacity: table6.capacity }];
                }
                if (partySize <= 8) {
                    const tables4 = availableTables.filter(t => t.capacity === 4).slice(0, 2);
                    if (tables4.length === 2) {
                        return tables4.map(t => ({ table_id: t.id, name: t.name, table_number: t.table_number, area: t.area, capacity: t.capacity }));
                    }
                }
                const tables4 = availableTables.filter(t => t.capacity === 4);
                const needed = Math.ceil(partySize / 4);
                if (tables4.length >= needed) {
                    return tables4.slice(0, needed).map(t => ({ table_id: t.id, name: t.name, table_number: t.table_number, area: t.area, capacity: t.capacity }));
                }
                return null;
            }

            const { data: allTables } = await supabase
                .from('tables')
                .select('id, name, table_number, area, capacity')
                .eq('is_active', true)
                .order('capacity', { ascending: true });

            if (allTables && allTables.length > 0) {
                const endDatetime = getEndDatetime(datetimeIso);
                const { data: assignments } = await supabase
                    .from('table_assignments')
                    .select('table_id, datetime_iso')
                    .eq('status', 'active')
                    .gte('datetime_iso', datetimeIso)
                    .lt('datetime_iso', endDatetime);

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

                const availableTables = allTables.filter(t => !occupiedTableIds.has(t.id));
                const tableCombination = findTableCombination(parseInt(data.party_size), availableTables);
                if (!tableCombination) {
                    return {
                        statusCode: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({ success: false, error: 'No available tables for this party size and time' })
                    };
                }
                tableAssignments = tableCombination;
            }
        }

        // Create table assignments (no reservation_id for OpenTable blocks)
        if (tableAssignments.length > 0) {
            const assignmentInserts = tableAssignments.map(table => ({
                date: data.date,
                time: data.time,
                datetime_iso: datetimeIso,
                duration_minutes: 90,
                table_id: table.table_id,
                reservation_id: null, // OpenTable blocks don't have reservation_id
                source: 'opentable',
                status: 'active',
                notes: data.notes || `OpenTable reservation${data.name ? ` - ${data.name}` : ''}`
            }));

            const { data: inserted, error } = await supabase
                .from('table_assignments')
                .insert(assignmentInserts)
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
                body: JSON.stringify({
                    success: true,
                    assignments: inserted,
                    tables: tableAssignments.map(t => ({ name: t.name, area: t.area }))
                })
            };
        } else {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: false, error: 'No tables assigned' })
            };
        }

    } catch (error) {
        console.error('Error adding OpenTable reservation:', error);
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


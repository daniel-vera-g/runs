import Papa from 'papaparse';

export interface Workout {
    description: string;
    notes?: string;
    targetDistance?: number;
}

export interface TrainingWeek {
    weeksUntilRace: number;
    fractionOfPeak: number;
    q1: Workout;
    q2: Workout;
    weeklyEasyMileage: number;
    actualMileage?: number;
    difference?: number;
    notes?: string;
}

export const parseTrainingPlan = (csvText: string): TrainingWeek[] => {
    const lines = csvText.split('\n');
    // Skip the first 10 lines (header metadata) manually as per the file structure
    // The structure seems to have actual data starting from line 11 (index 10)
    // But line 10 (index 9) is the header "Weeks until race,..."

    // We can use PapaParse with "header: true" but we need to pass only the relevant part.
    // Or we can just slice the array.

    // Looking at the file content:
    // Line 1-9: Metadata
    // Line 10: Headers (Weeks until race, Fraction of peak...)
    // Line 11+: Data

    const dataLines = lines.slice(9).join('\n'); // Keep headers

    // FIX: The specific CSV has unquoted headers with commas "Notes Q1, for Q1"
    // which causes shifting of columns. We sanitize this known header row.
    let sanitizedDataLines = dataLines;
    const headerRow = lines[9];
    if (headerRow && headerRow.includes('Notes Q1, for Q1')) {
        // Replace the unquoted header with quoted version in the first line
        const fixedHeader = headerRow
            .replace('Notes Q1, for Q1', '"Notes Q1, for Q1"')
            .replace('Notes Q2, for Q2', '"Notes Q2, for Q2"');

        // Reconstruct data block with fixed header
        sanitizedDataLines = [fixedHeader, ...lines.slice(10)].join('\n');
    }

    const { data } = Papa.parse(sanitizedDataLines, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Auto convert numbers
    });

    // Map the raw CSV data to our strict interface
    return data.map((row: any) => {
        // Helper to safely get string
        const getStr = (key: string) => row[key] ? String(row[key]).trim() : '';
        // Helper to safely get number (handling potential parsing errors)
        const getNum = (key: string) => {
            const val = row[key];
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
                const parsed = parseFloat(val);
                return isNaN(parsed) ? undefined : parsed;
            }
            return undefined;
        }

        return {
            weeksUntilRace: getNum('Weeks until race') || 0,
            fractionOfPeak: getNum('Fraction of peak') || 0,
            q1: {
                description: getStr('Workout Q1 (k)'),
                notes: getStr('Notes Q1, for Q1'),
            },
            q2: {
                description: getStr('Worout Q2 ()'), // Note the typo in CSV header 'Worout'
                notes: getStr('Notes Q2, for Q2'),
            },
            weeklyEasyMileage: getNum('Weekly Easy Mileage (k)') || 0,
            actualMileage: getNum('Actual (k)'),
            difference: getNum('Difference (k)'),
            notes: getStr('Notes'),
        };
    }).filter(week => week.weeksUntilRace !== 0 || week.q1.description !== ''); // Simple filter for empty rows if any
};

export const convertToCSV = (weeks: TrainingWeek[], originalHeaderLines: string[]) => {
    // We need to reconstruct the CSV.
    // 1. Join the original headers but apply the same fix to ensure future stability
    const headerSection = originalHeaderLines.map(line => {
        if (line.includes('Notes Q1, for Q1') && !line.includes('"Notes Q1, for Q1"')) {
            return line
                .replace('Notes Q1, for Q1', '"Notes Q1, for Q1"')
                .replace('Notes Q2, for Q2', '"Notes Q2, for Q2"');
        }
        return line;
    }).join('\n');

    // 2. Map data to rows
    // Columns: ,,,Weeks until race,Fraction of peak,Workout Q1 (k),Notes Q1, for Q1,Worout Q2 (),Notes Q2, for Q2,Weekly Easy Mileage (k),Actual (k),Difference (k),Notes

    const escape = (str?: string | number) => {
        if (str === undefined || str === null) return '';
        const s = String(str);
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };

    const dataRows = weeks.map(w => {
        // There are 3 empty columns at start
        return [
            '', '', '',
            w.weeksUntilRace,
            w.fractionOfPeak,
            escape(w.q1.description),
            escape(w.q1.notes),
            escape(w.q2.description),
            escape(w.q2.notes),
            w.weeklyEasyMileage,
            w.actualMileage === undefined ? '' : w.actualMileage,
            w.difference === undefined ? '' : w.difference,
            escape(w.notes)
        ].join(',');
    }).join('\n');

    return headerSection + '\n' + dataRows;
};

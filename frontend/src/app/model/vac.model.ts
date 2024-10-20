export interface ViolenceAgainstChildren {
    id: number;
    month: string;
    number_vac: number;
    male: number;
    female: number;
    range_one: number;
    range_two: number;
    range_three: number;
    range_four: number;
    range_five: number;
    physical_abuse: number;
    sexual_abuse: number;
    psychological_abuse: number;
    neglect: number;
    others: number;
    immediate_family: number;
    other_close_relative: number;
    acquaintance: number;
    stranger: number;
    local_official: number;
    law_enforcer: number;
    other_guardians: number;
    referred_pnp: number;
    referred_nbi: number;
    referred_medical: number;
    referred_legal_assist: number;
    referred_others: number;
    trainings: number;
    counseling: number;
    iec: number;
    fund_allocation: number;
    remarks: string;
    barangay: string;
    status: string;

    // Add index signature
    [key: string]: number | string;
}

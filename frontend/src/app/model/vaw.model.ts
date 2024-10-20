// user.model.ts
export interface ViolenceAgainstWomen {
    id: number;
    number_vaw: number;
    physical_abuse: number;
    sexual_abuse: number;
    psychological_abuse: number;
    economic_abuse: number;
    issued_bpo: number;
    referred_lowdo: number;
    referred_court: number;
    referred_pnp: number;
    referred_nbi: number;
    referred_medical: number;
    month: string;
    trainings: number;
    counseling: number;
    iec: number;
    fund_allocation: number;
    remarks: string;
    barangay: string;
    status: string;
}
  
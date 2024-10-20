// user.model.ts
export interface Audits {
    id: number;
    email: string;
    event: string;
    full_name: string;
    barangay: string;
    old_values: [];
    new_values: [];
    created_at: Date;
}
  
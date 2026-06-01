import { BaseRepository } from '@/infrastructure/repository/BaseRepository';
import type { Supplier, SupplierCreate } from '@/types';

interface RawSupplier {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  user_id: string;
  created_at: string;
  updated_at: string | null;
}

export class SupplierRepository extends BaseRepository<Supplier, SupplierCreate> {
  protected tableName = 'suppliers';

  protected toModel(raw: Record<string, unknown>): Supplier {
    const r = raw as unknown as RawSupplier;
    return {
      id: r.id,
      name: r.name,
      address: r.address ?? undefined,
      phone: r.phone ?? undefined,
      userId: r.user_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at ?? undefined,
    };
  }

  protected toCreateInput(data: SupplierCreate): Record<string, unknown> {
    return {
      name: data.name,
      address: data.address ?? null,
      phone: data.phone ?? null,
    };
  }
}

export const supplierRepository = new SupplierRepository();

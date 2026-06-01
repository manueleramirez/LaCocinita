import { supplierRepository } from '@/infrastructure/repository/implementations/SupplierRepository';
import type { Supplier, SupplierCreate } from '@/types';

export async function getAllSuppliers(userId: string) {
  return supplierRepository.getAll(userId);
}

export async function createSupplier(data: SupplierCreate) {
  return supplierRepository.create(data);
}

export async function updateSupplier(id: string, data: SupplierCreate) {
  return supplierRepository.update(id, data);
}

export async function deleteSupplier(id: string) {
  return supplierRepository.delete(id);
}

export type { Supplier, SupplierCreate };

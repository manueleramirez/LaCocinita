import * as orderRepository from '@/infrastructure/repository/implementations/OrderRepository';
import type { OrderCreate } from '@/types';

export async function getAllOrders(userId: string) {
  return orderRepository.getAllOrders(userId);
}

export async function createOrder(data: OrderCreate) {
  return orderRepository.createOrder(data);
}

export async function updateOrder(id: string, data: OrderCreate) {
  return orderRepository.updateOrder(id, data);
}

export async function deleteOrder(id: string) {
  return orderRepository.deleteOrder(id);
}

export async function getOrderById(id: string) {
  return orderRepository.getOrderById(id);
}

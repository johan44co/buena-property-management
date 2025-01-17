import { calculateRentDue } from '../src/util/rent-due';
import { Unit, RentPayment } from '@prisma/client';

describe('rent-due calculations', () => {
  const mockUnit: Unit = {
    id: '1',
    leaseStart: new Date('2024-01-01'),
    leaseEnd: new Date('2024-12-31'),
    rentAmount: 1000,
    tenantId: '1',
    propertyId: '1',
    unitNumber: '1',
    isOccupied: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPayments: RentPayment[] = [];

  test('calculateRentDue returns correct structure', () => {
    const result = calculateRentDue(mockUnit, mockPayments);
    
    expect(result).toHaveProperty('leaseStart');
    expect(result).toHaveProperty('leaseEnd');
    expect(result).toHaveProperty('totalDue');
    expect(result).toHaveProperty('dueDate');
    expect(result).toHaveProperty('nextDueDate');
    expect(result).toHaveProperty('rentStatus');
    expect(result).toHaveProperty('periods');
  });

  test('rent periods are calculated correctly', () => {
    const result = calculateRentDue(mockUnit, mockPayments);
    
    expect(result.periods.length).toBe(12); // Full year lease
    expect(result.periods[0].amount).toBe(1000); // First month full amount
    expect(result.totalDue).toBe(12000); // Full year rent
  });

  test('rent status shows pending when there are no payments', () => {
    const result = calculateRentDue(mockUnit, mockPayments);
    
    expect(result.rentStatus.pending).toBe(true);
    expect(result.rentStatus.daysLate).toBeGreaterThanOrEqual(0);
  });
});
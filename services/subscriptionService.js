export function calculateEndDate(startDate, frequency) {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + frequency);
    return endDate;
  }
  
  export function calculateStatus({ startDate, frequency, price, feesPaid }) {
    const now = new Date();
    const endDate = calculateEndDate(startDate, frequency);
  
    if (endDate < now && feesPaid < price) {
      return { status: 'pending and expired', endDate };
    } else if (endDate < now) {
      return { status: 'expired', endDate };
    } else if (feesPaid < price) {
      return { status: 'pending', endDate };
    } else {
      return { status: 'active', endDate };
    }
  }
const vietnameseNumberFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return `${vietnameseNumberFormatter.format(amount)} đ`;
}

export function formatPricePerHour(pricePerHour: number): string {
  return `${formatCurrency(pricePerHour)}/giờ`;
}

export function formatHourRange(startHour: number, hours: number): string {
  const endHour = startHour + hours;
  const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`;
  return `${formatHour(startHour)} – ${formatHour(endHour)}`;
}

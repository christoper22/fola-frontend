export const formatRupiah = (value: number) => {
  if (typeof value !== 'number') return ''
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}

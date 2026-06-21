const required = [
  {
    keys: ['PAYLOAD_SECRET'],
    hint: 'Tạo chuỗi ngẫu nhiên dài, ví dụ: openssl rand -base64 32',
  },
  {
    keys: ['DATABASE_URL', 'POSTGRES_URL'],
    hint: 'Kết nối Neon/Vercel Postgres trong Vercel Storage',
  },
] as const

const missing = required
  .filter(({ keys }) => !keys.some((key) => process.env[key]))
  .map(({ keys, hint }) => `- ${keys.join(' hoặc ')}: ${hint}`)

if (missing.length) {
  console.error('Thiếu biến môi trường bắt buộc cho deploy Vercel:\n')
  console.error(missing.join('\n'))
  console.error('\nVào Vercel → Project → Settings → Environment Variables')
  console.error('Bật cho Production, Preview và Development (ít nhất Production).')
  process.exit(1)
}
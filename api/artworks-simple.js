export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 返回模拟数据，避免数据库连接问题
    res.status(200).json({
      items: [],
      total: 0,
      page: 1,
      totalPages: 0,
      isEmpty: true
    })
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

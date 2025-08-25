import { verifyToken, requireAdmin } from '../lib/auth.js'
import formidable from 'formidable'
import { v4 as uuidv4 } from 'uuid'

// 禁用默认的 body parser，因为我们要处理文件上传
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // 验证管理员权限
  try {
    await verifyToken(req, res)
    await requireAdmin(req, res)
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }

  try {
    const form = formidable({
      maxFiles: 12,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: (part) => {
        return part.mimetype?.includes('image/') || false
      }
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err)
        return res.status(400).json({ error: 'Failed to parse form data' })
      }

      const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images]
      
      if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: 'No images uploaded' })
      }

      if (uploadedFiles.length > 12) {
        return res.status(400).json({ error: 'Maximum 12 images allowed' })
      }

      const processedImages = []

      for (const file of uploadedFiles) {
        try {
          // 生成唯一文件名
          const filename = `${uuidv4()}.${file.originalFilename.split('.').pop()}`
          
          // 暂时不处理图片，直接返回文件信息
          // 在生产环境中，这里应该将图片上传到云存储（如 AWS S3、Cloudinary）
          processedImages.push({
            originalName: file.originalFilename,
            filename: filename,
            size: file.size,
            mimetype: file.mimetype
          })
        } catch (error) {
          console.error('Image processing error:', error)
          return res.status(500).json({ error: 'Failed to process image' })
        }
      }

      res.status(200).json({
        message: 'Images uploaded successfully',
        images: processedImages
      })
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
}

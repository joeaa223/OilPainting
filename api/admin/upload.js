import { verifyToken, requireAdmin } from '../lib/auth'
import formidable from 'formidable'
import sharp from 'sharp'
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
    await verifyToken(req, res, () => {})
    await requireAdmin(req, res, () => {})
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' })
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
          const filename = `${uuidv4()}.jpg`
          
          // 处理图片：调整大小并转换为 JPEG
          const processedBuffer = await sharp(file.filepath)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer()

          // 生成缩略图
          const thumbnailBuffer = await sharp(file.filepath)
            .resize(300, 300, { fit: 'cover' })
            .jpeg({ quality: 80 })
            .toBuffer()

          // 这里应该将图片保存到云存储（如 AWS S3、Cloudinary）
          // 暂时返回处理后的图片信息
          processedImages.push({
            originalName: file.originalFilename,
            filename: filename,
            size: processedBuffer.length,
            thumbnailSize: thumbnailBuffer.length,
            mimetype: 'image/jpeg'
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

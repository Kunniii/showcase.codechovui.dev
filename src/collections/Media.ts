import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file && req.file.data) {
          try {
            // Only try parsing images
            if (req.file.mimetype?.startsWith('image/')) {
              // Dynamically import exifr to avoid client-side bundling warnings
              const exifr = (await import('exifr')).default
              const exifData = await exifr.parse(req.file.data)
              if (exifData) {
                // Ensure exif group exists
                data.exif = data.exif || {}
                
                // Camera
                if (exifData.Make || exifData.Model) {
                  data.exif.camera = [exifData.Make, exifData.Model].filter(Boolean).join(' ')
                }
                
                // Lens
                if (exifData.LensModel) {
                  data.exif.lens = exifData.LensModel
                }
                
                // Aperture
                if (exifData.FNumber) {
                  data.exif.aperture = `f/${exifData.FNumber}`
                }
                
                // Shutter Speed
                if (exifData.ExposureTime) {
                  if (exifData.ExposureTime < 1) {
                    data.exif.shutterSpeed = `1/${Math.round(1 / exifData.ExposureTime)}s`
                  } else {
                    data.exif.shutterSpeed = `${exifData.ExposureTime}s`
                  }
                }
                
                // ISO
                if (exifData.ISO) {
                  data.exif.iso = exifData.ISO.toString()
                }
                
                // Focal Length
                if (exifData.FocalLength) {
                  data.exif.focalLength = `${exifData.FocalLength}mm`
                }
              }
            }
          } catch (err) {
            req.payload.logger.error(`Error parsing EXIF: ${err}`)
          }
        }
        return data
      }
    ]
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'exif',
      type: 'group',
      label: 'Thông số EXIF (Tự động trích xuất)',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'camera',
          type: 'text',
          label: 'Máy ảnh (Camera)',
        },
        {
          name: 'lens',
          type: 'text',
          label: 'Ống kính (Lens)',
        },
        {
          name: 'aperture',
          type: 'text',
          label: 'Khẩu độ (Aperture)',
        },
        {
          name: 'shutterSpeed',
          type: 'text',
          label: 'Tốc độ (Shutter Speed)',
        },
        {
          name: 'iso',
          type: 'text',
          label: 'ISO',
        },
        {
          name: 'focalLength',
          type: 'text',
          label: 'Tiêu cự (Focal Length)',
        },
      ],
    },
  ],
  upload: true,
}

/**
 * Supabase Storage Utilities
 * 
 * Handles file uploads and signed URL generation for proposal exports.
 */

import { createClient } from './supabaseServer'

const EXPORTS_BUCKET = 'exports'

/**
 * Create signed URL for file download
 * 
 * @param bucket - Storage bucket name
 * @param path - File path within bucket
 * @param expiresIn - URL expiration in seconds (default: 60)
 */
export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 60
): Promise<string> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      console.error('[storage] Error creating signed URL:', error)
      throw new Error('Failed to create signed URL')
    }

    if (!data?.signedUrl) {
      throw new Error('No signed URL returned')
    }

    console.info('[storage] Signed URL created:', { bucket, path, expiresIn })
    return data.signedUrl
  } catch (error) {
    console.error('[storage] Exception in createSignedUrl:', error)
    throw error
  }
}

/**
 * Upload file to storage
 * 
 * @param bucket - Storage bucket name
 * @param path - Destination path within bucket
 * @param file - File data (Buffer or Blob)
 * @param contentType - MIME type
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer | Blob,
  contentType: string
): Promise<string> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: false, // Don't overwrite existing files
      })

    if (error) {
      console.error('[storage] Error uploading file:', error)
      throw new Error('Failed to upload file')
    }

    console.info('[storage] File uploaded:', { bucket, path })
    return data.path
  } catch (error) {
    console.error('[storage] Exception in uploadFile:', error)
    throw error
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error('[storage] Error deleting file:', error)
      throw new Error('Failed to delete file')
    }

    console.info('[storage] File deleted:', { bucket, path })
  } catch (error) {
    console.error('[storage] Exception in deleteFile:', error)
    throw error
  }
}

/**
 * Create signed URL for proposal export (convenience helper)
 */
export async function createProposalExportUrl(
  userId: string,
  proposalId: string,
  expiresIn: number = 300 // 5 minutes default
): Promise<string> {
  const path = `${userId}/${proposalId}.docx`
  return createSignedUrl(EXPORTS_BUCKET, path, expiresIn)
}


// app/actions/website-settings.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { WebsiteSettings } from '@prisma/client'

export type WebsiteSettingsInput = Omit<WebsiteSettings, 'id' | 'createdAt' | 'updatedAt'>

export async function getWebsiteSettings() {
  try {
    const settings = await prisma.websiteSettings.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return settings
  } catch (error) {
    console.error('Error fetching website settings:', error)
    throw new Error('Failed to fetch website settings')
  }
}

export async function getWebsiteSettingsById(id: number) {
  try {
    const settings = await prisma.websiteSettings.findUnique({
      where: { id }
    })
    return settings
  } catch (error) {
    console.error('Error fetching website settings:', error)
    throw new Error('Failed to fetch website settings')
  }
}

export async function createWebsiteSettings(data: WebsiteSettingsInput) {
  try {
    const result = await prisma.websiteSettings.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
    
    revalidatePath('/admin/website-settings')
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating website settings:', error)
    throw new Error('Failed to create website settings')
  }
}

export async function updateWebsiteSettings(id: number, data: WebsiteSettingsInput) {
  try {
    const result = await prisma.websiteSettings.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    })
    
    revalidatePath('/admin/website-settings')
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error updating website settings:', error)
    throw new Error('Failed to update website settings')
  }
}

export async function deleteWebsiteSettings(id: number) {
  try {
    await prisma.websiteSettings.delete({
      where: { id }
    })
    
    revalidatePath('/admin/website-settings')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting website settings:', error)
    throw new Error('Failed to delete website settings')
  }
}
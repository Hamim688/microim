import { z } from "zod"

export const projectInquirySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  whatsapp: z.string().min(9, "Nomor WhatsApp minimal 9 digit"),
  projectType: z.enum([
    "IoT Development",
    "Hardware Prototyping",
    "Embedded Programming",
    "Mobile Application",
    "Automation System",
    "Custom Project",
    "Component Request",
    "Other",
  ]),
  budget: z.string().optional(),
  description: z.string().min(10, "Deskripsi kebutuhan minimal 10 karakter"),
  timeline: z.string().optional(),
})

export type ProjectInquiryInput = z.infer<typeof projectInquirySchema>

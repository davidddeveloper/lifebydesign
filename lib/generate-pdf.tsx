import { pdf } from "@react-pdf/renderer"
import { AuditResultsPDF } from "@/components/AuditResultsPDF"
import { AuditResultsPDFV2, type AuditPDFData } from "@/components/AuditResultsPDFV2"

export async function generatePDFBlob(data: Parameters<typeof AuditResultsPDF>[0]["data"]): Promise<Blob> {
  return pdf(<AuditResultsPDF data={data} />).toBlob()
}

export async function generatePDFBlobV2(data: AuditPDFData): Promise<Blob> {
  return pdf(<AuditResultsPDFV2 data={data} />).toBlob()
}

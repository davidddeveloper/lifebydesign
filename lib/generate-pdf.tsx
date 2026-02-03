import { pdf } from "@react-pdf/renderer"
import { AuditResultsPDF } from "@/components/AuditResultsPDF"

export async function generatePDFBlob(data: Parameters<typeof AuditResultsPDF>[0]["data"]): Promise<Blob> {
  return pdf(<AuditResultsPDF data={data} />).toBlob()
}

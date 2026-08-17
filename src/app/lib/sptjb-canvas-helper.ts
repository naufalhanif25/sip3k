import { ParsedHeaderFooterProps, SPTJBMetadataProps, ParsedHeaderFooter } from "@/app/props/sptjb"
import { replacePlaceholders } from "@/app/lib/sptjb-table-helper"

export function parseExcelHeaderFooter(
    metadata: SPTJBMetadataProps,
    text: string
): ParsedHeaderFooterProps {
    const result = ParsedHeaderFooter.parse({ left: "", center: "", right: "" })
    if (!text) return result

    const processedText = replacePlaceholders(text, metadata) as string
    const parts = processedText.split(/(&L|&C|&R)/g)
    let currentSection: keyof ParsedHeaderFooterProps | null = null

    for (const part of parts) {
        if (part === "&L") {
            currentSection = "left"
        } else if (part === "&C") {
            currentSection = "center"
        } else if (part === "&R") {
            currentSection = "right"
        } else if (currentSection && part) {
            const cleanedText = part
                .replace(/&"[^"]*"/g, "")
                .replace(/&[B|I|U|S|E|X]/g, "")
                .replace(/&\d+/g, "")
            result[currentSection] += cleanedText
        }
    }
    return result
}

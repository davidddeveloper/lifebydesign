"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CTASectionData {
    heading?: string
    subheading?: string
    ctaButton?: { text?: string; url?: string }
}

interface CTASectionProps {
    data?: CTASectionData
    onOpenForm?: () => void
}

export function CTASection({ data, onOpenForm }: CTASectionProps) {
    const heading = data?.heading
    const subheading = data?.subheading
    const buttonText = data?.ctaButton?.text
    const buttonUrl = data?.ctaButton?.url

    return (
        <section className="bg-[#1e293b] py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                {heading && (
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                        {heading}
                    </h2>
                )}
                {subheading && (
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        {subheading}
                    </p>
                )}
                {buttonText && (
                    buttonUrl ? (
                        <Link href={buttonUrl}>
                            <Button
                                size="default"
                                className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
                            >
                                {buttonText}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            onClick={onOpenForm}
                            size="default"
                            className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
                        >
                            {buttonText}
                        </Button>
                    )
                )}
            </div>
        </section>
    )
}

/**
 * Black Moss & Herbs Platform - Google Maps Embed
 * Free, no-API-key iframe embed. Only renders when NEXT_PUBLIC_BUSINESS_ADDRESS
 * is set - there's no physical address to show otherwise.
 */
export default function GoogleMapEmbed() {
    const address = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS

    if (!address) return null

    const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

    return (
        <div className="rounded-2xl overflow-hidden border border-earth-800 aspect-video">
            <iframe
                src={src}
                title="Business location"
                loading="lazy"
                className="w-full h-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    )
}

/**
 * Black Moss & Herbs Platform - Google reCAPTCHA v3 Verification
 * Free tier. Skipped entirely (returns true) when RECAPTCHA_SECRET_KEY is
 * not set, so forms keep working unchanged until it's configured.
 */
export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) return true
    if (!token) return false

    try {
        const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret: secretKey, response: token }),
        })
        const data = await res.json()
        // v3 returns a 0-1 human-likelihood score; 0.5 is Google's own suggested default cutoff.
        return data.success === true && (data.score === undefined || data.score >= 0.5)
    } catch (e) {
        console.error('[recaptcha] verification request failed:', e)
        return false
    }
}

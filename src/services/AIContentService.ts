/**
 * Black Moss & Herbs Platform - AI Content Engine
 *
 * Generates SEO-style wellness articles in the voice of a chosen author persona
 * using Claude, then persists them as drafts for admin review.
 */
import { prisma } from '@/lib/prisma'
import { createMessage, isAIConfigured, firstText } from '@/lib/anthropic'
import { getPersona, DEFAULT_PERSONA_KEY } from '@/lib/personas'
import { sanitizeWellnessContent } from '@/lib/compliance'
import { slugify } from '@/lib/utils'

export interface GeneratedContent {
    title: string
    excerpt: string
    content: string // HTML
    category: string
    socials: {
        instagram: string
        twitter: string
        linkedin: string
    }
}

const OUTPUT_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
        title: { type: 'string' },
        excerpt: { type: 'string' },
        content: { type: 'string', description: 'The full article body as semantic HTML (h2/h3/p/ul/li/strong). No <html> or <body> wrapper.' },
        category: { type: 'string' },
        socials: {
            type: 'object',
            additionalProperties: false,
            properties: {
                instagram: { type: 'string' },
                twitter: { type: 'string' },
                linkedin: { type: 'string' },
            },
            required: ['instagram', 'twitter', 'linkedin'],
        },
    },
    required: ['title', 'excerpt', 'content', 'category', 'socials'],
}

/**
 * Parse the model's JSON output defensively. Even with a JSON schema requested,
 * a fallback model may wrap the object in ```json fences or add a stray sentence,
 * so we strip fences and extract the outermost {...} before parsing.
 */
function parseJsonContent(text: string): GeneratedContent {
    let cleaned = text.trim()
    // Strip ```json ... ``` or ``` ... ``` fences if present.
    const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i)
    if (fence) cleaned = fence[1].trim()
    try {
        return JSON.parse(cleaned) as GeneratedContent
    } catch {
        // Last resort: grab the outermost JSON object.
        const first = cleaned.indexOf('{')
        const last = cleaned.lastIndexOf('}')
        if (first !== -1 && last > first) {
            return JSON.parse(cleaned.slice(first, last + 1)) as GeneratedContent
        }
        throw new Error('AI returned content that could not be parsed as JSON.')
    }
}

export class AIContentService {
    /**
     * Generate a full content pack for a topic in a persona's voice.
     * `personaKey` is one of the keys in src/lib/personas.ts.
     */
    static async generatePack(topic: string, personaKey: string = DEFAULT_PERSONA_KEY): Promise<GeneratedContent> {
        if (!isAIConfigured()) {
            throw new Error('AI is not configured. Set ANTHROPIC_API_KEY to enable article generation.')
        }

        const persona = getPersona(personaKey) ?? getPersona(DEFAULT_PERSONA_KEY)!

        const userPrompt = `Write an original Black Moss & Herbs article about: "${topic}".

Requirements:
- 600-900 words in your distinct voice and genre.
- Body as semantic HTML using <h2>, <h3>, <p>, <ul>/<li>, and <strong>. No title <h1>, no <html>/<body> wrapper.
- A compelling title (no "Black Moss" prefix) and a one-sentence excerpt.
- Pick the single best category from: Sea Moss, Herbal Wisdom, Alkaline Living, Superfoods, Wellness Science, Traditional Remedies.
- Three short social captions (instagram, twitter, linkedin) promoting the article.
- Stay strictly within the compliance rules.`

        const response = await createMessage({
            max_tokens: 8000,
            system: persona.systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
            extra: { output_config: { format: { type: 'json_schema', schema: OUTPUT_SCHEMA } } },
        })

        const text = firstText(response)
        if (!text) {
            throw new Error('AI returned no content.')
        }

        const parsed = parseJsonContent(text)

        // Apply compliance sanitisation as a safety net on top of the prompt rules.
        parsed.content = sanitizeWellnessContent(parsed.content)
        parsed.excerpt = sanitizeWellnessContent(parsed.excerpt)

        return parsed
    }

    /**
     * Persist generated content as an unpublished draft attributed to the persona.
     */
    static async saveToDrafts(data: GeneratedContent, personaKey: string) {
        const baseSlug = slugify(data.title) || `article-${Date.now()}`
        // Ensure slug uniqueness (slug is @unique in the schema).
        let slug = baseSlug
        if (await prisma.blogPost.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${Date.now().toString(36)}`
        }

        return prisma.blogPost.create({
            data: {
                title: data.title,
                slug,
                excerpt: data.excerpt,
                content: data.content,
                category: data.category,
                authorPersona: personaKey,
                published: false,
            },
        })
    }
}

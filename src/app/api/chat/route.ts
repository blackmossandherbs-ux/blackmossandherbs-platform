/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Alchemist AI API
 */
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message, guideId } = await req.json();

        // This is a placeholder for actual AI model integration (e.g., OpenAI, Anthropic, or local Ollama)
        // For now, it provides a structured response system that fits the "AI Ready" requirement.

        console.log(`[AI Chat] Request from guide ${guideId}: ${message}`);

        // Simulate AI thinking delay
        await new Promise(resolve => setTimeout(resolve, 800));

        let response = "";
        const lower = message.toLowerCase();

        // Relational Alchemical Mapping
        if (lower.includes('sea moss')) {
            response = "Sea Moss is honestly one of nature's best gifts. It’s like a mineral reset button for your body—giving you 92 of the 102 minerals we need. It helps with energy, skin, and just feeling 'full' of life again. Have you tried it before, or are you just exploring?";
        } else if (lower.includes('iron') || lower.includes('blood') || lower.includes('anemia')) {
            response = "I hear you. When your iron is low, everything feels harder. We focus on 'botanical iron' because it's plant-based, so it actually absorbs into your system properly without hurting your stomach. It helps build your blood back up so you can breathe easier.";
        } else if (lower.includes('stress') || lower.includes('tired') || lower.includes('energy')) {
            response = "That's real. The world is heavy right now. Your nervous system might just need a momentary pause. Things like Blue Vervain or Valerian Root can act like a gentle 'off switch' for the noise, helping you rest so you can come back stronger.";
        } else if (lower.includes('skin') || lower.includes('hair') || lower.includes('beauty')) {
            response = "Beauty starts inside, truly. When we clean the blood, the skin clears up as a reflection of that inner health. Hydration and minerals are your best friends here. Are you drinking enough water with your minerals?";
        } else {
            response = "I'm listening. Wellness is a journey, and it can be confusing with so much noise out there. I'm here to help you filter through it and find what actually feels right for your body. What's been on your mind lately?";
        }

        return NextResponse.json({
            content: response, // Removing the hard sales pitch suffix
            status: 'success'
        });

    } catch (error) {
        console.error('[AI Chat API] Error:', error);
        return NextResponse.json({ error: 'Internal system failure in logic stream.' }, { status: 500 });
    }
}

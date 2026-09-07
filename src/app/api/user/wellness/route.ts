import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { biologicalProfile: true }
        });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({
            profile: user.biologicalProfile,
            isNew: !user.biologicalProfile
        });

    } catch (error) {
        console.error('[Wellness API] Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await req.json();
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const profile = await prisma.biologicalProfile.upsert({
            where: { userId: user.id },
            update: {
                healthGoals: data.healthGoals,
                dietType: data.dietType,
                allergies: data.allergies,
                primaryAilments: data.primaryAilments,
                currentMedications: data.currentMedications,
                digestion: data.digestion,
                sleepHours: data.sleepHours,
                stressLevel: data.stressLevel,
            },
            create: {
                userId: user.id,
                healthGoals: data.healthGoals || [],
                dietType: data.dietType || 'Standard',
                allergies: data.allergies || [],
                primaryAilments: data.primaryAilments || null,
                currentMedications: data.currentMedications || null,
                digestion: data.digestion || 'Regular',
                sleepHours: data.sleepHours || '6-8',
                stressLevel: data.stressLevel || 'Moderate',
            }
        });

        return NextResponse.json({ success: true, profile });

    } catch (error) {
        console.error('[Wellness API] Error updating profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

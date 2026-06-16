import { NextResponse } from 'next/server';

export async function GET() {
    // Esto genera un bucle pesado para saturar intencionalmente la CPU
    let i = 0;
    const start = Date.now();
    while (Date.now() - start < 100) {
        i += Math.random() * Math.random();
    }
    return NextResponse.json({ message: "Ataque HTTP procesado", result: i });
}

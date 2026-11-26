import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

/**
 * Grades a quiz answer server-side. The correct index and explanation are never
 * sent to the browser with the question, so the only way to obtain them is to
 * actually answer.
 */
export async function POST(request: Request) {
  let body: { questionId?: unknown; choice?: unknown }
  try {
    body = (await request.json()) as { questionId?: unknown; choice?: unknown }
  } catch {
    return NextResponse.json({ error: 'Permintaan tidak valid.' }, { status: 400 })
  }

  const { questionId, choice } = body
  if (typeof questionId !== 'number' || !Number.isInteger(questionId)) {
    return NextResponse.json({ error: 'Soal tidak valid.' }, { status: 400 })
  }
  if (typeof choice !== 'number' || !Number.isInteger(choice) || choice < 0) {
    return NextResponse.json({ error: 'Jawaban tidak valid.' }, { status: 400 })
  }

  const payload = await getPayloadClient()
  const question = await payload.findByID({
    collection: 'quiz-questions',
    id: questionId,
    depth: 0,
    overrideAccess: true,
    disableErrors: true,
  })

  if (!question || typeof question.answer !== 'number') {
    return NextResponse.json({ error: 'Soal tidak ditemukan.' }, { status: 404 })
  }
  if (choice >= question.options.length) {
    return NextResponse.json({ error: 'Jawaban tidak valid.' }, { status: 400 })
  }

  return NextResponse.json({
    correct: choice === question.answer,
    explanation: question.explanation,
  })
}

import axios from 'axios'

export type PendingAttempt = {
    product: 'nursing' | 'teas'
    productLabel: string
    endpoint: string
    reportBaseRoute: string
    fallbackRoute: string
    payload: Record<string, unknown>
    score: number
    examTitle?: string
    createdAt: string
}

const PENDING_ATTEMPT_KEY = 'nursedive_pending_attempt'

export const savePendingAttempt = (attempt: Omit<PendingAttempt, 'createdAt'>) => {
    if (typeof window === 'undefined') return

    window.sessionStorage.setItem(
        PENDING_ATTEMPT_KEY,
        JSON.stringify({
            ...attempt,
            createdAt: new Date().toISOString(),
        }),
    )
}

export const getPendingAttempt = (): PendingAttempt | null => {
    if (typeof window === 'undefined') return null

    const raw = window.sessionStorage.getItem(PENDING_ATTEMPT_KEY)
    if (!raw) return null

    try {
        return JSON.parse(raw) as PendingAttempt
    } catch {
        window.sessionStorage.removeItem(PENDING_ATTEMPT_KEY)
        return null
    }
}

export const clearPendingAttempt = () => {
    if (typeof window === 'undefined') return
    window.sessionStorage.removeItem(PENDING_ATTEMPT_KEY)
}

export const flushPendingAttempt = async () => {
    const pendingAttempt = getPendingAttempt()
    if (!pendingAttempt) return null

    const response = await axios.post(pendingAttempt.endpoint, pendingAttempt.payload)
    const attemptId = response.data?.data?.id ?? response.data?.data?.attempt_id

    clearPendingAttempt()

    return {
        attempt: pendingAttempt,
        attemptId,
        redirectTo: attemptId
            ? `${pendingAttempt.reportBaseRoute}/${attemptId}`
            : pendingAttempt.fallbackRoute,
    }
}

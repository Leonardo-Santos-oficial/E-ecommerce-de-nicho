import { describe, it, expect, vi } from 'vitest'
import {
  handleDigitKeyDown,
  handlePasteDigits,
  sanitizeDigits,
  isControlKey,
} from '@/utils/inputGuards'

function mockKeyEvent(key: string, opts: Partial<KeyboardEvent> = {}) {
  return {
    key,
    preventDefault: vi.fn(),
    ctrlKey: !!opts.ctrlKey,
    metaKey: !!opts.metaKey,
  } as any
}

describe('inputGuards', () => {
  it('allow control keys', () => {
    const ev = mockKeyEvent('Backspace')
    handleDigitKeyDown(ev)
    expect(ev.preventDefault).not.toHaveBeenCalled()
    expect(isControlKey(ev)).toBe(true)
  })

  it('blocks non-digit', () => {
    const ev = mockKeyEvent('x')
    handleDigitKeyDown(ev)
    expect(ev.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('allows digits', () => {
    const ev = mockKeyEvent('7')
    handleDigitKeyDown(ev)
    expect(ev.preventDefault).not.toHaveBeenCalled()
  })

  it('sanitizeDigits removes non digits', () => {
    expect(sanitizeDigits('12a3-45 ')).toBe('12345')
  })

  it('handlePasteDigits applies only digits up to maxLen', () => {
    const apply = vi.fn()
    const clip = {
      clipboardData: { getData: () => '12a3b4c5d6789' },
      preventDefault: vi.fn(),
    }
    handlePasteDigits(clip as any, apply, 6)
    expect(clip.preventDefault).toHaveBeenCalled()
    expect(apply).toHaveBeenCalledWith('123456')
  })
})

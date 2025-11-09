import { cn } from '../lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'should-not-appear')
      expect(result).toBe('base conditional')
    })

    it('should merge tailwind classes properly', () => {
      const result = cn('px-2', 'px-4')
      // twMerge should keep only the last px- class
      expect(result).toBe('px-4')
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle objects with conditional classes', () => {
      const result = cn({
        'class1': true,
        'class2': false,
        'class3': true
      })
      expect(result).toBe('class1 class3')
    })

    it('should handle complex tailwind conflicts', () => {
      const result = cn('bg-red-500', 'bg-blue-500')
      expect(result).toBe('bg-blue-500')
    })

    it('should preserve important classes', () => {
      const result = cn('!text-red-500', 'text-blue-500')
      expect(result).toContain('!text-red-500')
    })
  })
})

import { organizers, specialThanks } from '../components/data/eventData'

describe('Event Data', () => {
  describe('Organizers', () => {
    it('should have at least one organizer', () => {
      expect(organizers).toBeDefined()
      expect(organizers.length).toBeGreaterThan(0)
    })

    it('should have required fields for each organizer', () => {
      organizers.forEach(organizer => {
        expect(organizer).toHaveProperty('id')
        expect(organizer).toHaveProperty('name')
        expect(organizer).toHaveProperty('role')
        expect(organizer).toHaveProperty('image')
        expect(organizer).toHaveProperty('bio')
      })
    })

    it('should have unique IDs for each organizer', () => {
      const ids = organizers.map(org => org.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have valid image paths', () => {
      organizers.forEach(organizer => {
        expect(organizer.image).toMatch(/^\/organizers\/.+\.(jpg|jpeg|png|webp)$/i)
      })
    })

    it('should have non-empty names', () => {
      organizers.forEach(organizer => {
        expect(organizer.name.trim().length).toBeGreaterThan(0)
      })
    })

    it('should have non-empty roles', () => {
      organizers.forEach(organizer => {
        expect(organizer.role.trim().length).toBeGreaterThan(0)
      })
    })

    it('should have non-empty bios', () => {
      organizers.forEach(organizer => {
        expect(organizer.bio.trim().length).toBeGreaterThan(0)
      })
    })

    it('should have lead organizer as first item', () => {
      expect(organizers[0].role).toContain('Chief')
    })
  })

  describe('Special Thanks', () => {
    it('should have special thanks data defined', () => {
      expect(specialThanks).toBeDefined()
    })

    it('should have required fields', () => {
      expect(specialThanks).toHaveProperty('id')
      expect(specialThanks).toHaveProperty('name')
      expect(specialThanks).toHaveProperty('role')
      expect(specialThanks).toHaveProperty('domain')
      expect(specialThanks).toHaveProperty('image')
      expect(specialThanks).toHaveProperty('bio')
      expect(specialThanks).toHaveProperty('quote')
    })

    it('should have correct convener name', () => {
      expect(specialThanks.name).toBe('Dr. A. Obulesu')
    })

    it('should have correct role', () => {
      expect(specialThanks.role).toBe('IT - HOD')
    })

    it('should have valid image path', () => {
      expect(specialThanks.image).toMatch(/^\/converner\/.+\.(jpg|jpeg|png|webp)$/i)
    })

    it('should have non-empty domain', () => {
      expect(specialThanks.domain.trim().length).toBeGreaterThan(0)
    })

    it('should have non-empty bio', () => {
      expect(specialThanks.bio.trim().length).toBeGreaterThan(0)
    })
  })
})

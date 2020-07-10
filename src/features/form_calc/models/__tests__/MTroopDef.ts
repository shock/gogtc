import Big from 'big.js'
import { toInt, toBig } from '../../../../lib/fixed-point'
import { TroopType } from '../../../../lib/fc-types'
import { MTroopDef } from '../'
import config from '../../../../config'

describe( 'MTroopDef', () => {

  describe('constructor', () => {
    it('should return an instance of MTroopDef', () => {
      const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000))
      expect(troopDef instanceof MTroopDef).toEqual(true)
    })
      it('should set the constructor properties', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000))
        expect(troopDef.type).toEqual(TroopType.Infantry)
        expect(troopDef.count.toString()).toEqual('1000')
    })
  })

  describe('calculateAndUpdatePercent()', () => {
    describe('when tier capacity is greater than 0', () => {
      it('should calculate and set the proper percentage with configured decimal places', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000))
        expect(troopDef.count).toEqual(toInt(1000))
        troopDef.calculateAndUpdatePercent(toInt(3000))
        expect(troopDef.percent.toString()).toEqual(toBig('33.333333333333333333333').round(config.calcPrecision).toString())
        troopDef.count = toInt(2000)
        const returnedPercent = troopDef.calculateAndUpdatePercent(toInt(3000))
        expect(troopDef.percent.toString()).toEqual(toBig('66.666666666666666666666').round(config.calcPrecision).toString())
        expect(troopDef.percent.toString()).toEqual(returnedPercent.toString())
      })
    })
    describe('when tier capacity is 0', () => {
      it('should calculate and set 0', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000))
        expect(troopDef.count).toEqual(toInt(1000))
        const returnedPercent = troopDef.calculateAndUpdatePercent(toInt(0))
        expect(troopDef.percent.toString()).toEqual('0')
        expect(troopDef.percent.toString()).toEqual(returnedPercent.toString())
      })
    })
  })

  describe('updateCount()', () => {
    it('should change the count', () => {
      const troopDef = new MTroopDef(TroopType.Infantry, toInt(999))
      troopDef.updateCount(toInt(0))
      expect(troopDef.count.toString()).toEqual('0')
    })
  })

  describe('calculateAndUpdateCount', () => {
    describe('when count is unlocked', () => {
      it('should calculate the correct count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(0))
        troopDef.percent = toBig(66.6667)
        troopDef.calculateAndUpdateCount(toInt(1000))
        expect(troopDef.count.toString()).toEqual('667')
      })
      it('should return the updated count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(0))
        troopDef.percent = toBig(66.6667)
        expect(troopDef.calculateAndUpdateCount(toInt(1000)).toString()).toEqual('667')
      })
    })
    describe('when count is locked', () => {
      it('should not update the count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(0))
        troopDef.percent = toBig(66.6667)
        troopDef.updateCountLock(true)
        troopDef.calculateAndUpdateCount(toInt(1000))
        expect(troopDef.count.toString()).toEqual('0')
      })
    })

  })

  describe('updateCountLock()', () => {
    it('should set it to the supplied value', () => {
      const troopDef = new MTroopDef(TroopType.Infantry, toInt(999))
      expect(troopDef.countLocked).toBe(false)
      troopDef.updateCountLock(true)
      expect(troopDef.countLocked).toBe(true)
      troopDef.updateCountLock(false)
      expect(troopDef.countLocked).toBe(false)
    })

  })

  describe('serialization', () => {
    describe('toJsonObject', () => {
      it('should return an object', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(999), toBig(45.5), true)
        let obj = troopDef.toJsonObject()
        expect(obj instanceof Object).toBe(true)
      })
      it('should return an object with the same attributes', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(999), toBig(45.5), true)
        let obj = troopDef.toJsonObject()
        expect(obj.type).toStrictEqual(TroopType.Infantry as unknown as string)
        expect(obj.count).toStrictEqual(toInt(999))
        expect(obj.percent).toStrictEqual(toBig(45.5))
        expect(obj.countLocked).toStrictEqual(true)
      })
    })

    describe('static fromJsonObject', () => {
      const makeTroopDefObj = () => {
        return {
          type: "Infantry",
          count: toInt(999),
          percent: toBig(45.5),
          countLocked: true
        }
      }
      it('should return an MTroopDef instance', () => {
        const obj = makeTroopDefObj()
        const troopDef = MTroopDef.fromJsonObject(obj)
        expect(troopDef instanceof MTroopDef).toBe(true)
      })
      it('should return an object with the same attribute', () => {
        const obj = makeTroopDefObj()
        const troopDef = MTroopDef.fromJsonObject(obj)
        expect(troopDef.type).toStrictEqual(TroopType.Infantry)
        expect(troopDef.count).toStrictEqual(toInt(999))
        expect(troopDef.percent).toStrictEqual(toBig(45.5))
        expect(troopDef.count instanceof Big).toBeTruthy()
        expect(troopDef.percent instanceof Big).toBeTruthy()
        expect(troopDef.countLocked).toStrictEqual(true)
      })
      describe('with missing props', () => {
        it('should throw an error', () => {
          const obj = makeTroopDefObj()
          delete obj.countLocked
          expect( () => MTroopDef.fromJsonObject(obj) ).toThrow(Error)
        })
      })
    })

    describe('round trip', () => {
      it('should work', () => {
        const origTroopDef = new MTroopDef(TroopType.Infantry, toInt(999), toBig(45.5), true)
        const reconstructedTroopDef = MTroopDef.fromJsonObject(origTroopDef.toJsonObject())
        reconstructedTroopDef.key = origTroopDef.key
        expect( origTroopDef ).toEqual(reconstructedTroopDef)
      })

    })
  })

})

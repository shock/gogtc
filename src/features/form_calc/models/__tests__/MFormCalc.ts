import Big from 'big.js'
import { toInt, toBig } from '../../../../lib/fixed-point'
import { TierNum } from '../../../../lib/fc-types'
import { MFormCalc, MTierDef} from '..'
import { buildFormCalcWithTiers } from '../../lib/test_helper'

describe( 'MTierDef', () => {

  describe('constructor', () => {
    it('should return an instance of MFormCalc', () => {
      const instance = new MFormCalc('test')
      expect(instance instanceof MFormCalc).toEqual(true)
    })
      it('should set the name property', () => {
        const instance = new MFormCalc('test')
        expect(instance.name).toEqual('test')
    })
  })

  describe('clone()', () => {
    it('should return an instance of MFormCalc', () => {
      const clone = new MFormCalc('test').clone()
      expect(clone instanceof MFormCalc).toEqual(true)
    })
      it('should have the same properties', () => {
        const formCalc = new MFormCalc('test', toInt(999))
        formCalc.changed = !formCalc.changed
        formCalc.persisted = !formCalc.persisted
        formCalc.preset = !formCalc.preset
        const clone = formCalc.clone()
        expect(clone.name).toEqual('test')
        expect(clone.marchCap.toString()).toEqual('999')
        expect(clone.changed).toEqual(formCalc.changed)
        expect(clone.persisted).toEqual(formCalc.persisted)
        expect(clone.preset).toEqual(formCalc.preset)
    })
  })

  describe('findTierDef()', () => {
    describe('with no tierDefs', () => {
      it('should throw an Error', () => {
        const formCalc = new MFormCalc('test')
        expect(
          () => {formCalc.findTierDef(':'+TierNum.T12)}
        ).toThrow(Error)
      })
    })
    describe('with tierDefs', () => {
      describe('with valid TierNum', () => {
        it('should find the tierDef ', () => {
          const formCalc = buildFormCalcWithTiers()
          const found = formCalc.findTierDef(':'+TierNum.T12)
          expect( found instanceof MTierDef ).toBe(true)
          expect( found.tierNum ).toEqual( TierNum.T12 )
        })
      })
      describe('with invalid TierNum', () => {
        it('should throw an Error', () => {
          const formCalc = buildFormCalcWithTiers()
          expect(
            () => {formCalc.findTierDef(':'+TierNum.T1)}
          ).toThrow(Error)
        })
      })
    })
  })

  describe('getCapFromTierDefs()', () => {
    it('should return the appropriate integer', () => {
      const formCalc = buildFormCalcWithTiers()
      expect(formCalc.getCapFromTierDefs().toString()).toBe('12000')
      formCalc.tierDefs[0].troopDefs[0].updateCount(formCalc.tierDefs[0].troopDefs[0].count.minus(1000))
      expect(formCalc.getCapFromTierDefs().toString()).toBe('11000')
    })

  })

  describe('serialization', () => {
    describe('toJsonObject', () => {
      it('should return an object', () => {
        const formCalc = new MFormCalc('test', toInt(999))
        let obj = formCalc.toJsonObject()
        expect(obj instanceof Object).toBe(true)
      })
      it('should return an object with the same attributes', () => {
        const formCalc = new MFormCalc('test', toInt(999))
        let obj = formCalc.toJsonObject()
        expect(obj.name).toStrictEqual('test')
        expect(obj.marchCap).toStrictEqual(toInt(999))
        expect(obj.id).toStrictEqual(formCalc.id)
      })
      it('serialize the tierDefs', () => {
        const formCalc = buildFormCalcWithTiers()
        let obj = formCalc.toJsonObject()
        const tierDefs = obj.tierDefs
        expect(tierDefs instanceof Array).toBe(true)
        expect(tierDefs.length).toBe(2)
      })
    })

    describe('static fromJsonObject', () => {
      const makeFormCalcObj = () => {
        return {
          name: 'test',
          marchCap: toInt(999),
          tierDefs: [makeTierDefObj()],
          id: 'id'
        }
      }
      const makeTierDefObj = () => {
        return {
          tierNum: 'T12',
          capacity: toInt(999),
          percent: toBig(45.5),
          capacityLocked: true,
          troopDefs: [makeTroopDefObj()]
        }
      }
      const makeTroopDefObj = () => {
        return {
          type: "Infantry",
          count: toInt(999),
          percent: toBig(45.5),
          countLocked: true
        }
      }

      it('should return an MFormCalc instance', () => {
        const obj = makeFormCalcObj()
        const formCalc = MFormCalc.fromJsonObject(obj)
        expect(formCalc instanceof MFormCalc).toBe(true)
      })
      it('should return an object with the same attributes', () => {
        const obj = makeFormCalcObj()
        const formCalc = MFormCalc.fromJsonObject(obj)
        expect(formCalc.name).toStrictEqual(obj.name)
        expect(formCalc.marchCap).toStrictEqual(obj.marchCap)
        expect(formCalc.marchCap instanceof Big).toBeTruthy()
      })
      it('should deserialize the tierDefs', () => {
        const obj = makeFormCalcObj()
        const formCalc = MFormCalc.fromJsonObject(obj)
        expect(formCalc.tierDefs.length).toEqual(1)
        expect(formCalc.tierDefs[0] instanceof MTierDef).toBe(true)
      })
      describe('with missing props', () => {
        it('should throw an error', () => {
          const obj = makeFormCalcObj()
          delete obj.marchCap
          expect( () => MFormCalc.fromJsonObject(obj) ).toThrow(Error)
        })
      })
    })

    describe('round trip', () => {
      it('should work', () => {
        const origFormCalc = new MFormCalc('test', toInt(999), true)
        const reconstructedFormCalc = MFormCalc.fromJsonObject(origFormCalc.toJsonObject())
        reconstructedFormCalc.key = origFormCalc.key
        expect( origFormCalc ).toEqual(reconstructedFormCalc)
      })

    })
  })

})

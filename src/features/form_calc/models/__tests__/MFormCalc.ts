import { TierNum, toInt, toBig } from '../../types';
import { MFormCalc, MTierDef} from '..';
import { buildFormCalcWithTiers } from '../../lib/test_helper';

describe( 'MTierDef', () => {

  describe('constructor', () => {
    it('should return an instance of MFormCalc', () => {
      let instance = new MFormCalc('test');
      expect(instance instanceof MFormCalc).toEqual(true);
    });
      it('should set the name property', () => {
        let instance = new MFormCalc('test');
        expect(instance.name).toEqual('test');
    });
  });

  describe('findTierDef()', () => {
    describe('with no tierDefs', () => {
      it('should throw an Error', () => {
        const formCalc = new MFormCalc('test');
        expect(
          () => {formCalc.findTierDef(':'+TierNum.T12)}
        ).toThrow(Error);
      });
    });
    describe('with tierDefs', () => {
      describe('with valid TierNum', () => {
        it('should find the tierDef ', () => {
          const formCalc = buildFormCalcWithTiers();
          const found = formCalc.findTierDef(':'+TierNum.T12);
          expect( found instanceof MTierDef ).toBe(true);
          expect( found.tierNum ).toEqual( TierNum.T12 );
        });
      });
      describe('with invalid TierNum', () => {
        it('should throw an Error', () => {
          const formCalc = buildFormCalcWithTiers();
          expect(
            () => {formCalc.findTierDef(':'+TierNum.T1)}
          ).toThrow(Error);
        });
      });
    });
  });

  describe('getCapFromTierDefs()', () => {
    it('should return the appropriate integer', () => {
      const formCalc = buildFormCalcWithTiers();
      expect(formCalc.getCapFromTierDefs().toString()).toBe('12000');
      formCalc.tierDefs[0].troopDefs[0].updateCount(formCalc.tierDefs[0].troopDefs[0].count.minus(1000));
      expect(formCalc.getCapFromTierDefs().toString()).toBe('11000');
    });

  });

  describe('serialization', () => {
    describe('toJsonObject', () => {
      it('should return an object', () => {
        const formCalc = new MFormCalc('test', toInt(999))
        let obj = formCalc.toJsonObject()
        expect(obj instanceof Object).toBe(true)
      });
      it('should return an object with the same attributes', () => {
        const formCalc = new MFormCalc('test', toInt(999))
        let obj = formCalc.toJsonObject()
        expect(obj.name).toStrictEqual('test')
        expect(obj.marchCap).toStrictEqual(toInt(999))
      });
      it('serialize the tierDefs', () => {
        const formCalc = buildFormCalcWithTiers()
        let obj = formCalc.toJsonObject()
        const tierDefs = obj.tierDefs
        expect(tierDefs instanceof Array).toBe(true)
        expect(tierDefs.length).toBe(2)
      });
    });

    describe('static fromJsonObject', () => {
      const makeFormCalcObj = () => {
        return {
          name: 'test',
          marchCap: toInt(999),
          tierDefs: [makeTierDefObj()]
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
      });
      it('should return an object with the same attributes', () => {
        const obj = makeFormCalcObj()
        const formCalc = MFormCalc.fromJsonObject(obj)
        expect(formCalc.name).toStrictEqual('test')
        expect(formCalc.marchCap).toStrictEqual(toInt(999))
      });
      it('should deserialize the tierDefs', () => {
        const obj = makeFormCalcObj()
        const formCalc = MFormCalc.fromJsonObject(obj)
        expect(formCalc.name).toStrictEqual('test')
        expect(formCalc.marchCap).toStrictEqual(toInt(999))
      });
      describe('with missing props', () => {
        it('should throw an error', () => {
          const obj = makeFormCalcObj()
          delete obj.marchCap
          expect( () => MFormCalc.fromJsonObject(obj) ).toThrow(Error)
        });
      });
    });

    describe('round trip', () => {
      it('should work', () => {
        const origFormCalc = new MFormCalc('test', toInt(999))
        const reconstructedFormCalc = MFormCalc.fromJsonObject(origFormCalc.toJsonObject())
        origFormCalc.key = '1'
        reconstructedFormCalc.key = '1'
        origFormCalc.id = '1'
        reconstructedFormCalc.id = '1'
        expect( origFormCalc ).toEqual(reconstructedFormCalc)
      });

    });
  });

});

import { Int, TierNum, TroopType, NumEntry, KeyedNumEntry } from '../../types';
import { MFormCalc, MTroopDef, MTierDef } from '..';
import { buildTierWithTroopDefs, buildFormCalcWithTiers } from '../test_helper';
import formCalcReducer from '../../reducer';

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

  describe('getNumEntries()', () => {
    it('should return num entries for the troop defs', () => {
      const formCalc = new MFormCalc('test');
      let tierDef = buildTierWithTroopDefs(TierNum.T12, formCalc);
      formCalc.tierDefs = [tierDef];
      const testNumEntries:KeyedNumEntry = {
        "test:T12:Cavalry":  {
          "id": "test:T12:Cavalry",
          "label": "Cavalry",
          "value": "2000",
        },
        "test:T12:Distance":  {
          "id": "test:T12:Distance",
          "label": "Distance",
          "value": "3000",
        },
        "test:T12:Infantry":  {
          "id": "test:T12:Infantry",
          "label": "Infantry",
          "value": "1000",
        }
      }
      const numEntries = formCalc.getNumEntries();
      expect(numEntries).toEqual(testNumEntries);
    });
  });

  describe('findTierDef()', () => {
    describe('with no tierDefs', () => {
      it('should throw an Error', () => {
        const formCalc = new MFormCalc('test');
        expect(
          () => {formCalc.findTierDef(TierNum.T12)}
        ).toThrow(Error);
      });
    });
    describe('with tierDefs', () => {
      describe('with valid TierNum', () => {
        it('should find the tierDef ', () => {
          const formCalc = buildFormCalcWithTiers();
          const found = formCalc.findTierDef(TierNum.T12);
          expect( found instanceof MTierDef ).toBe(true);
          expect( found.tierNum ).toEqual( TierNum.T12 );
        });
      });
      describe('with invalid TierNum', () => {
        it('should throw an Error', () => {
          const formCalc = buildFormCalcWithTiers();
          expect(
            () => {formCalc.findTierDef(TierNum.T1)}
          ).toThrow(Error);
        });
      });
    });
  });
});

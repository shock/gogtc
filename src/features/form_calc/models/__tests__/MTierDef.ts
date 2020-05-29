import { Int, TierNum, TroopType, NumEntry, KeyedNumEntry } from '../../types';
import { MFormCalc, MTroopDef, MTierDef } from '..';
import { buildTierWithTroopDefs, buildFormCalcWithTiers } from '../test_helper';

describe( 'MTierDef', () => {

  describe('constructor', () => {
    it('should return an instance of MTierDef', () => {
      let instance = new MTierDef(TierNum.T12);
      expect(instance instanceof MTierDef).toEqual(true);
    });
      it('should set the tierNum property', () => {
        let instance = new MTierDef(TierNum.T12);
        expect(instance.tierNum).toEqual(TierNum.T12);
    });
  });

  describe('getNumEntries()', () => {
    it('should return num entries for the troop defs', () => {
      let instance = buildTierWithTroopDefs(TierNum.T12);
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
      const numEntries = instance.getNumEntries();
      expect(numEntries).toEqual(testNumEntries);
    });
  });

  describe('findTroopDef()', () => {
    describe('with no troopDefs', () => {
      it('should throw an Error', () => {
        const tierDef = new MTierDef(TierNum.T12);
        expect(
          () => {tierDef.findTroopDef(TroopType.Infantry)}
        ).toThrow(Error);
      });
    });
    describe('with troopDefs', () => {
      describe('with valid TierNum', () => {
        it('should find the tierDef ', () => {
          const tierDef = buildTierWithTroopDefs(TierNum.T12);
          tierDef.findTroopDef(TroopType.Infantry);
        });
      });
      describe('with invalid TierNum', () => {
        it('should throw an Error', () => {
          const tierDef = buildTierWithTroopDefs(TierNum.T12);
          expect(
            () => {tierDef.findTroopDef(TroopType.Artillery)}
          ).toThrow(Error);
        });
      });
    });
  });

});

import { Int, TierNum, TroopType, NumEntry, KeyedNumEntry } from '../../types';
import { MFormCalc, MTroopDef, MTierDef } from '..';
import { buildTierWithTroopDefs } from '../test_helper';

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

});

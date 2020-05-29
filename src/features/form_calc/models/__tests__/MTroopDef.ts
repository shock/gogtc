import { Int, TierNum, TroopType, NumEntry, KeyedNumEntry } from '../../types';
import { MFormCalc, MTroopDef } from '..';
import { buildTierWithTroopDefs, buildTroopDefs, buildTroopDef } from '../test_helper';

describe( 'MTroopDef', () => {

  describe('constructor', () => {
    it('should return an instance of MTroopDef', () => {
      let instance = new MTroopDef(TroopType.Infantry, 1000 as Int);
      expect(instance instanceof MTroopDef).toEqual(true);
    });
      it('should set the constructor properties', () => {
        let instance = new MTroopDef(TroopType.Infantry, 1000 as Int);
        expect(instance.type).toEqual(TroopType.Infantry);
        expect(instance.count).toEqual(1000 as Int);
    });
  });

  describe('getNumEntry()', () => {
    it('should return an appropriate instance of NumEntry', () => {
      let instance = buildTroopDef(TroopType.Infantry, 1000 as Int);
      const testNumEntry:NumEntry = {
        "id": "test:T12:Infantry",
        "label": "Infantry",
        "value": "1000",
      }
      const numEntry = instance.getNumEntry();
      expect(numEntry).toEqual(testNumEntry);
    });
  });

});

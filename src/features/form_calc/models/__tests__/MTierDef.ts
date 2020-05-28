import { Int, TierNum, TroopType, NumEntry, KeyedNumEntry } from '../../types';
import { MFormCalc, MTroopDef, MTierDef } from '..';

describe( 'MTierDef', () => {

  const formCalc = new MFormCalc('test');

  function buildTroopDefs(tierDef:MTierDef):MTroopDef[] {
    const troopDefs =  [
      new MTroopDef(
        TroopType.Infantry,
        1000 as Int,
      ),
      new MTroopDef(
        TroopType.Cavalry,
        2000 as Int,
      ),
      new MTroopDef(
        TroopType.Distance,
        3000 as Int,
      ),
    ];
    troopDefs.forEach( (troopDef) => {
      troopDef.tierDef = tierDef;
    });
    return troopDefs;
  }

  function buildWithTroopDefs(tierNum:TierNum):MTierDef {
    let tierDef = new MTierDef(tierNum);
    tierDef.troopDefs = buildTroopDefs(tierDef);
    tierDef.formCalc = formCalc;
    return tierDef;
  }

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
    it('should return an instance of MTierDef', () => {
      let instance = buildWithTroopDefs(TierNum.T12);
      const numEntries:KeyedNumEntry = {
        "test:12:Cavalry":  {
          "id": "test:12:Cavalry",
          "label": "Cavalry",
          "value": "2000",
        },
        "test:12:Distance":  {
          "id": "test:12:Distance",
          "label": "Distance",
          "value": "3000",
        },
        "test:12:Infantry":  {
          "id": "test:12:Infantry",
          "label": "Infantry",
          "value": "1000",
        }
      }
      expect(instance.getNumEntries()).toEqual(numEntries);
    });
      it('should set the tierNum property', () => {
        let instance = new MTierDef(TierNum.T12);
        expect(instance.tierNum).toEqual(TierNum.T12);
    });
  });

});

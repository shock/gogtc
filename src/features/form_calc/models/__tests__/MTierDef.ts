import { MTierDef } from '../MTierDef';
import { Int, TroopDef, TierNum, TroopType, TierDef, FormCalc } from '../../types';
import { MFormCalc } from '../MFormCalc';

describe( 'MTierDef', () => {

  function buildTroopDefs(tierNum:TierNum):TroopDef[] {
    return [
      new TroopDef(
        TroopType.Infantry,
        tierNum,
        1 as Int,
      ),

    ];
  }

  describe('constructor', () => {
    let formCalc = new MFormCalc('test', [] as TierDef[]);
    it('should return an instance of MTierDef', () => {
      let instance = new MTierDef(formCalc, TierNum.T12, buildTroopDefs(TierNum.T12));
      expect(instance instanceof MTierDef).toEqual(true);
    });
    it('should set the formCalc property', () => {
      let instance = new MTierDef(formCalc, TierNum.T12, buildTroopDefs(TierNum.T12));
      expect(instance.formCalc).toEqual(formCalc);
    });
    it('should set the tierNum property', () => {
      let instance = new MTierDef(formCalc, TierNum.T12, buildTroopDefs(TierNum.T12));
      expect(instance.tierNum).toEqual(TierNum.T12);
    });
  });

});

import { MTierDef } from '../MTierDef';
import { Int, TroopDef, TierNum, TroopType, TierDef } from '../../types';

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
    it('should return an instance of MTierDef', () => {
      let instance = new MTierDef(TierNum.T12, buildTroopDefs(TierNum.T12));
      expect(instance instanceof MTierDef).toEqual(true);
    });
    it('should set the tierNum property', () => {
      let instance = new MTierDef(TierNum.T12, buildTroopDefs(TierNum.T12));
      expect(instance.tierNum).toEqual(TierNum.T12);
    });
  });

});

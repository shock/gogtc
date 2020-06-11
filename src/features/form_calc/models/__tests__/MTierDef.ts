import { toInt, toBig, TierNum, TroopType } from '../../types';
import { MTroopDef, MTierDef } from '..';
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

  describe('getCapFromTroopDefs()', () => {
    it('should return the appropriate integer', () => {
      const tierDef = buildTierWithTroopDefs(TierNum.T1);
      expect(tierDef.getCapFromTroopDefs()).toEqual(toInt(6000));
      tierDef.troopDefs[0].updateCount(tierDef.troopDefs[0].count.minus(1000));
      expect(tierDef.getCapFromTroopDefs()).toEqual(toInt(5000));
    });

  });

  describe('calculateAndUpdatePercent()', () => {
    describe('when marchCap is greater than 0', () => {
      it('should calculate and set the proper percentage with 20 decimal places', () => {
        const tierDef = buildTierWithTroopDefs(TierNum.T12);
        const tierCap = tierDef.getCapFromTroopDefs();
        expect(tierCap).toEqual(toInt(6000));
        tierDef.updateCap(tierCap);
        tierDef.calculateAndUpdatePercent(toInt(18000));
        expect(tierDef.percent.toString()).toEqual('33.33333333333333333333');
        const returnedPercent = tierDef.calculateAndUpdatePercent(toInt(9000));
        expect(tierDef.percent.toString()).toEqual('66.66666666666666666667');
        expect(tierDef.percent.toString()).toEqual(returnedPercent.toString());
      });
    });
    describe('when marchCap is 0', () => {
      it('should calculate and set 0', () => {
        const tierDef = buildTierWithTroopDefs(TierNum.T12);
        const tierCap = tierDef.getCapFromTroopDefs();
        expect(tierCap).toEqual(toInt(6000));
        tierDef.updateCap(tierCap);
        const returnedPercent = tierDef.calculateAndUpdatePercent(toInt(0));
        expect(tierDef.percent.toString()).toEqual('0');
        expect(tierDef.percent.toString()).toEqual(returnedPercent.toString());
      });
    });
  });

  describe('updateCap()', () => {
    it('should change the capacity', () => {
      const tierDef = new MTierDef(TierNum.T12);
      tierDef.capacity = toInt(999);
      tierDef.updateCap(toInt(0));
      expect(tierDef.capacity.toString()).toEqual('0');
    });
  });

  describe('updatePercent()', () => {
    describe('when capacityLocked is true', () => {
      it('should not change the percent', () => {
        const tierDef = new MTierDef(TierNum.T12);
        tierDef.percent = toBig(32.2);
        tierDef.updateCapacityLock(true);
        tierDef.updatePercent(toBig(0));
        expect(tierDef.percent.toString()).toEqual('32.2');
      });
    });
    describe('when capacityLocked is false', () => {
      it('should change the percent', () => {
        const tierDef = new MTierDef(TierNum.T12);
        tierDef.percent = toBig(0);
        tierDef.updateCapacityLock(false);
        tierDef.updatePercent(toBig('32.2'));
        expect(tierDef.percent.toString()).toEqual('32.2');
      });
    });
  });

  describe('updateCapacityLock()', () => {
    it('should set it to the supplied value', () => {
      const tierDef = new MTierDef(TierNum.T12);
      expect(tierDef.capacityLocked).toBe(false);
      tierDef.updateCapacityLock(true);
      expect(tierDef.capacityLocked).toBe(true);
      tierDef.updateCapacityLock(false);
      expect(tierDef.capacityLocked).toBe(false);
    });
  });

  describe('getLockedTroopCount()', () => {
    it('should return the sum of only troopDef counts that are countLocked', () => {
      const tierDef = new MTierDef(TierNum.T12);
      const td1 = new MTroopDef(TroopType.Infantry, toInt(1000))
      td1.updateCountLock(true);
      const td2 = new MTroopDef(TroopType.Infantry, toInt(500))
      td2.updateCountLock(false);
      tierDef.troopDefs = [td1,td2];
      expect(tierDef.getLockedTroopCount().toString()).toEqual(td1.count.toString());
      td1.updateCountLock(false);
      td2.updateCountLock(true);
      expect(tierDef.getLockedTroopCount().toString()).toEqual(td2.count.toString());
    });

  });

});

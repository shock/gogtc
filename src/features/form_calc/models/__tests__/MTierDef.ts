import { toInt, TierNum, TroopType } from '../../types';
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
      expect(tierDef.getCapFromTroopDefs()).toBe(toInt(6000));
      tierDef.troopDefs[0].updateCount(tierDef.troopDefs[0].count-1000);
      expect(tierDef.getCapFromTroopDefs()).toBe(toInt(5000));
    });

  });

  describe('calculateAndUpdatePercent()', () => {
    describe('when marchCap is greater than 0', () => {
      it('should calculate and set the proper percentage with 4 decimal places', () => {
        const tierDef = buildTierWithTroopDefs(TierNum.T12);
        const tierCap = tierDef.getCapFromTroopDefs();
        expect(tierCap).toBe(toInt(6000));
        tierDef.updateCap(tierCap);
        tierDef.calculateAndUpdatePercent(toInt(18000));
        expect(tierDef.percent).toBe(33.3333);
        const returnedPercent = tierDef.calculateAndUpdatePercent(toInt(9000));
        expect(tierDef.percent).toBe(66.6667);
        expect(tierDef.percent).toBe(returnedPercent);
      });
    });
    describe('when marchCap is 0', () => {
      it('should calculate and set 0', () => {
        const tierDef = buildTierWithTroopDefs(TierNum.T12);
        const tierCap = tierDef.getCapFromTroopDefs();
        expect(tierCap).toBe(toInt(6000));
        tierDef.updateCap(tierCap);
        const returnedPercent = tierDef.calculateAndUpdatePercent(toInt(0));
        expect(tierDef.percent).toBe(0);
        expect(tierDef.percent).toBe(returnedPercent);
      });
    });
  });

  describe('updateCap()', () => {
    describe('when percentLocked is true', () => {
      it('should not change the capacity', () => {
        const tierDef = new MTierDef(TierNum.T12);
        tierDef.capacity = toInt(999);
        tierDef.updatePercentLock(true);
        tierDef.updateCap(toInt(0));
        expect(tierDef.capacity).toBe(999);
      });
    });
    describe('when percentLocked is false', () => {
      it('should change the capacity', () => {
        const tierDef = new MTierDef(TierNum.T12);
        tierDef.capacity = toInt(999);
        tierDef.updatePercentLock(false);
        tierDef.updateCap(toInt(0));
        expect(tierDef.capacity).toBe(toInt(0));
      });
    });
  });

  describe('updatePercent()', () => {
    describe('when capacityLocked is true', () => {
      it('should not change the percent', () => {
        const tierDef = new MTierDef(TierNum.T12);
        tierDef.percent = 32.2;
        tierDef.updateCapacityLock(true);
        tierDef.updatePercent(0);
        expect(tierDef.percent).toBe(32.2);
      });
    });
    describe('when capacityLocked is false', () => {
      it('should change the percent', () => {
        const tierDef = new MTierDef(TierNum.T12);
        tierDef.percent = 0;
        tierDef.updateCapacityLock(false);
        tierDef.updatePercent(32.2);
        expect(tierDef.percent).toBe(32.2);
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
    describe('setting to true', () => {
      describe('when percentLocked is true', () => {
        it('should set percentLocked to false', () => {
          const tierDef = new MTierDef(TierNum.T12);
          tierDef.percentLocked = true;
          tierDef.updateCapacityLock(true);
          expect(tierDef.percentLocked).toBe(false);
        });
      });
      describe('when percentLocked is true', () => {
        it('should leave percentLocked as false', () => {
          const tierDef = new MTierDef(TierNum.T12);
          tierDef.percentLocked = false;
          tierDef.updateCapacityLock(true);
          expect(tierDef.percentLocked).toBe(false);
        });
      });
    });
  });

  describe('updatePercentLock()', () => {
    it('should set it to the supplied value', () => {
      const tierDef = new MTierDef(TierNum.T12);
      expect(tierDef.percentLocked).toBe(false);
      tierDef.updatePercentLock(true);
      expect(tierDef.percentLocked).toBe(true);
      tierDef.updatePercentLock(false);
      expect(tierDef.percentLocked).toBe(false);
    });
    describe('setting to true', () => {
      describe('when capacityLocked is true', () => {
        it('should set capacityLocked to false', () => {
          const tierDef = new MTierDef(TierNum.T12);
          tierDef.capacityLocked = true;
          tierDef.updatePercentLock(true);
          expect(tierDef.capacityLocked).toBe(false);
        });
      });
      describe('when capacityLocked is true', () => {
        it('should leave capacityLocked as false', () => {
          const tierDef = new MTierDef(TierNum.T12);
          tierDef.capacityLocked = false;
          tierDef.updatePercentLock(true);
          expect(tierDef.capacityLocked).toBe(false);
        });
      });
    });
  });

});

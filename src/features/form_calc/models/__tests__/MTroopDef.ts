import { toInt, TroopType } from '../../types';
import { MTroopDef } from '../';

describe( 'MTroopDef', () => {

  describe('constructor', () => {
    it('should return an instance of MTroopDef', () => {
      const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000));
      expect(troopDef instanceof MTroopDef).toEqual(true);
    });
      it('should set the constructor properties', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000));
        expect(troopDef.type).toEqual(TroopType.Infantry);
        expect(troopDef.count).toEqual(toInt(1000));
    });
  });

  describe('calculateAndUpdatePercent()', () => {
    describe('when tier capacity is greater than 0', () => {
      it('should calculate and set the proper percentage with 4 decimal places', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000));
        expect(troopDef.count).toBe(toInt(1000));
        troopDef.calculateAndUpdatePercent(toInt(3000));
        expect(troopDef.percent).toBe(33.3333);
        troopDef.count = toInt(2000);
        const returnedPercent = troopDef.calculateAndUpdatePercent(toInt(3000));
        expect(troopDef.percent).toBe(66.6667);
        expect(troopDef.percent).toBe(returnedPercent);
      });
    });
    describe('when tier capacity is 0', () => {
      it('should calculate and set 0', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000));
        expect(troopDef.count).toBe(toInt(1000));
        const returnedPercent = troopDef.calculateAndUpdatePercent(toInt(0));
        expect(troopDef.percent).toBe(0);
        expect(troopDef.percent).toBe(returnedPercent);
      });
    });
  });

  describe('updateCount()', () => {
    describe('when percentLocked is true', () => {
      it('should not change the count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
        troopDef.updatePercentLock(true);
        troopDef.updateCount(toInt(0));
        expect(troopDef.count).toBe(999);
      });
    });
    describe('when percentLocked is false', () => {
      it('should change the count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
        troopDef.updatePercentLock(false);
        troopDef.updateCount(toInt(0));
        expect(troopDef.count).toBe(toInt(0));
      });
    });
  });

  describe('calculateAndUpdateCount', () => {
    describe('when count is unlocked', () => {
      it('should calculate the correct count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(0));
        troopDef.percent = 66.6667;
        troopDef.calculateAndUpdateCount(toInt(1000));
        expect(troopDef.count).toBe(toInt(667));
      });
      it('should return the updated count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(0));
        troopDef.percent = 66.6667;
        expect(troopDef.calculateAndUpdateCount(toInt(1000))).toBe(toInt(667));
      });
    });
    describe('when count is locked', () => {
      it('should not update the count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(0));
        troopDef.percent = 66.6667;
        troopDef.updateCountLock(true);
        troopDef.calculateAndUpdateCount(toInt(1000));
        expect(troopDef.count).toBe(toInt(0));
      });
    });

  });

  describe('updatePercent()', () => {
    describe('when countLocked is true', () => {
      it('should not change the percent', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
        troopDef.percent = 32.2;
        troopDef.updateCountLock(true);
        troopDef.updatePercent(0);
        expect(troopDef.percent).toBe(32.2);
      });
    });
    describe('when countLocked is false', () => {
      it('should change the percent', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
        troopDef.percent = 0;
        troopDef.updateCountLock(false);
        troopDef.updatePercent(32.2);
        expect(troopDef.percent).toBe(32.2);
      });
    });
  });

  describe('updateCountLock()', () => {
    it('should set it to the supplied value', () => {
      const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
      expect(troopDef.countLocked).toBe(false);
      troopDef.updateCountLock(true);
      expect(troopDef.countLocked).toBe(true);
      troopDef.updateCountLock(false);
      expect(troopDef.countLocked).toBe(false);
    });
    describe('setting to true', () => {
      describe('when percentLocked is true', () => {
        it('should set percentLocked to false', () => {
          const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
          troopDef.percentLocked = true;
          troopDef.updateCountLock(true);
          expect(troopDef.percentLocked).toBe(false);
        });
      });
      describe('when percentLocked is true', () => {
        it('should leave percentLocked as false', () => {
          const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
          troopDef.percentLocked = false;
          troopDef.updateCountLock(true);
          expect(troopDef.percentLocked).toBe(false);
        });
      });
    });

  });

  describe('updatePercentLock()', () => {
    it('should set it to the supplied value', () => {
      const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
      expect(troopDef.percentLocked).toBe(false);
      troopDef.updatePercentLock(true);
      expect(troopDef.percentLocked).toBe(true);
      troopDef.updatePercentLock(false);
      expect(troopDef.percentLocked).toBe(false);
    });
    describe('setting to true', () => {
      describe('when countLocked is true', () => {
        it('should set countLocked to false', () => {
          const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
          troopDef.countLocked = true;
          troopDef.updatePercentLock(true);
          expect(troopDef.countLocked).toBe(false);
        });
      });
      describe('when countLocked is true', () => {
        it('should leave countLocked as false', () => {
          const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
          troopDef.countLocked = false;
          troopDef.updatePercentLock(true);
          expect(troopDef.countLocked).toBe(false);
        });
      });
    });

  });


});

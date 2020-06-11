import { toInt, toBig, TroopType } from '../../types';
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
        expect(troopDef.count.toString()).toEqual('1000');
    });
  });

  describe('calculateAndUpdatePercent()', () => {
    describe('when tier capacity is greater than 0', () => {
      it('should calculate and set the proper percentage with 20 decimal places', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000));
        expect(troopDef.count).toEqual(toInt(1000));
        troopDef.calculateAndUpdatePercent(toInt(3000));
        expect(troopDef.percent.toString()).toEqual('33.33333333333333333333');
        troopDef.count = toInt(2000);
        const returnedPercent = troopDef.calculateAndUpdatePercent(toInt(3000));
        expect(troopDef.percent.toString()).toEqual('66.66666666666666666667');
        expect(troopDef.percent.toString()).toEqual(returnedPercent.toString());
      });
    });
    describe('when tier capacity is 0', () => {
      it('should calculate and set 0', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(1000));
        expect(troopDef.count).toEqual(toInt(1000));
        const returnedPercent = troopDef.calculateAndUpdatePercent(toInt(0));
        expect(troopDef.percent.toString()).toEqual('0');
        expect(troopDef.percent.toString()).toEqual(returnedPercent.toString());
      });
    });
  });

  describe('updateCount()', () => {
    it('should change the count', () => {
      const troopDef = new MTroopDef(TroopType.Infantry, toInt(999));
      troopDef.updateCount(toInt(0));
      expect(troopDef.count.toString()).toEqual('0');
    });
  });

  describe('calculateAndUpdateCount', () => {
    describe('when count is unlocked', () => {
      it('should calculate the correct count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(0));
        troopDef.percent = toBig(66.6667);
        troopDef.calculateAndUpdateCount(toInt(1000));
        expect(troopDef.count.toString()).toEqual('667');
      });
      it('should return the updated count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(0));
        troopDef.percent = toBig(66.6667);
        expect(troopDef.calculateAndUpdateCount(toInt(1000)).toString()).toEqual('667');
      });
    });
    describe('when count is locked', () => {
      it('should not update the count', () => {
        const troopDef = new MTroopDef(TroopType.Infantry, toInt(0));
        troopDef.percent = toBig(66.6667);
        troopDef.updateCountLock(true);
        troopDef.calculateAndUpdateCount(toInt(1000));
        expect(troopDef.count.toString()).toEqual('0');
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

  });

});

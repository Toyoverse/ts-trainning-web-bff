import { IsDateAfterConstraint } from 'src/utils/validation/is-date-after.constraint';

describe('IsDateAfterConstraint', () => {
  const constraint = new IsDateAfterConstraint();
  describe('validate', () => {
    it('Should return true when input date is after date specified by prop', () => {
      const isBeforeDate = new Date(2022, 8, 1);
      const isAfterDate = new Date(2022, 8, 2);
      const validationArgs = {
        value: isAfterDate,
        targetName: 'TestClass',
        property: 'endAt',
        object: {
          startAt: isBeforeDate,
        },
        constraints: ['startAt'],
      };
      const result = constraint.validate(isAfterDate, validationArgs);
      expect(result).toBeTruthy();
    });
    it('Should return false when input date is before date specified by prop', () => {
      const isBeforeDate = new Date(2022, 8, 3);
      const isAfterDate = new Date(2022, 8, 2);
      const validationArgs = {
        value: isAfterDate,
        targetName: 'TestClass',
        property: 'endAt',
        object: {
          startAt: isBeforeDate,
        },
        constraints: ['startAt'],
      };
      const result = constraint.validate(isAfterDate, validationArgs);
      expect(result).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('Should return expected message', () => {
      const afterProp = 'endAt';
      const beforeProp = 'startAt';

      const validationArgs = {
        value: new Date(),
        targetName: 'TestClass',
        property: afterProp,
        object: {},
        constraints: [beforeProp],
      };
      const result = constraint.defaultMessage(validationArgs);

      expect(result).toBe(`${afterProp} must be after ${beforeProp}`);
    });
  });
});

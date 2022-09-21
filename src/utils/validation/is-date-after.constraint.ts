import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsDateAfterConstraint implements ValidatorConstraintInterface {
  validate(
    afterDate: Date,
    validationArguments?: ValidationArguments,
  ): boolean {
    const [beforeProp] = validationArguments.constraints;
    const beforeDate = validationArguments.object[beforeProp];
    return afterDate > beforeDate;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const afterProp = validationArguments.property;
    const [beforeProp] = validationArguments.constraints;
    return `${afterProp} must be after ${beforeProp}`;
  }
}

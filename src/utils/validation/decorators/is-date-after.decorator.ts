import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsDateAfterConstraint } from '../is-date-after.constraint';

export default function IsDateAfter(
  prop: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [prop],
      validator: IsDateAfterConstraint,
    });
  };
}

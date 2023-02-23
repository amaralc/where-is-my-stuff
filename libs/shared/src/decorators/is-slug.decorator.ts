import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Custom validation decorator @see https://github.com/typestack/class-validator#custom-validation-decorators
 */

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsSlug',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isSlug = new RegExp('^[a-z0-9]+(?:-[a-z0-9]+)*$');
          return isSlug.test(value);
        },
      },
    });
  };
}

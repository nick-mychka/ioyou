import { isEmpty } from 'es-toolkit/compat';
import { z } from 'zod';

import { HttpRequestError } from '../repositories';
import type { ValidationErrors } from '../types/error.ts';

export type ParseErrorOptions<F extends string> = {
  fields?: F[];
  defaultGeneral: string;
};

abstract class BaseService {
  protected getGeneralError(error: HttpRequestError): string | null {
    let generalError = null;

    const hasGeneralError = !!error.errors?.error;

    if (hasGeneralError) {
      generalError = String(error.errors?.error);
    } else if (isEmpty(error.errors)) {
      generalError = error.message;
    }

    return generalError;
  }

  protected parseError<F extends string>(
    error: unknown,
    { fields, defaultGeneral }: ParseErrorOptions<F>
  ): ValidationErrors {
    if (error instanceof HttpRequestError) {
      const serverErrors = (fields ?? []).reduce(
        (acc, field) => {
          const rawError = error.errors?.[field];

          if (rawError) {
            acc[field] = String(Array.isArray(rawError) ? rawError[0] : rawError);
          }

          return acc;
        },
        {} as Record<F, string>
      );

      return {
        field: {},
        server: serverErrors,
        general: this.getGeneralError(error),
      };
    }

    // Handle unexpected errors
    return {
      field: {},
      server: {},
      general: defaultGeneral,
    };
  }

  protected parseZodError(error: z.ZodError, defaultMessage: string): string {
    return z.treeifyError(error).errors.join(', ') || defaultMessage;
  }
}

export { BaseService };

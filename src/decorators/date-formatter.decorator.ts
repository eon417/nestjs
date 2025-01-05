import { Transform } from 'class-transformer';
import { format } from 'date-fns';

export function DateFormatter() {
  return Transform(({ value }) => {
    if (value instanceof Date) {
      return format(value.toISOString(), 'yyyy-MM-dd');
    }
    return value;
  });
}

/**
 * Compares a to b and b to a.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shallowCompare<TA extends any, TB extends any>(a: TA, b: TB): boolean {
  for (let propName in a) {
    if (a.hasOwnProperty(propName)) {
      if (!b.hasOwnProperty(propName) || b[propName] !== a[propName]) {
        return false;
      }
    }
  }
  for (let propName in b) {
    if (b.hasOwnProperty(propName)) {
      if (!a.hasOwnProperty(propName)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Makes a resulting merge of a bunch of objects. Pass in the target object followed by 1 or more
 * objects as arguments and they will be merged sequentially into the target. Note that this will
 * shallow merge; it will not create new cloned values for target members.
 *
 * @public
 * @param target - Target object to merge following object arguments into.
 * @param args - One or more objects that will be mixed into the target in the order they are provided.
 * @returns Resulting merged target.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assign(target: any, ...args: any[]): any {
  return filteredAssign.apply(this, [null, target].concat(args));
}

/**
 * Makes a resulting merge of a bunch of objects, but allows a filter function to be passed in to filter
 * the resulting merges. This allows for scenarios where you want to merge "everything except that one thing"
 * or "properties that start with data-". Note that this will shallow merge; it will not create new cloned
 * values for target members.
 *
 * @public
 * @param isAllowed - Callback to determine if the given propName is allowed in the result.
 * @param target - Target object to merge following object arguments into.
 * @param args - One or more objects that will be mixed into the target in the order they are provided.
 * @returns Resulting merged target.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filteredAssign(isAllowed: (propName: string) => boolean, target: any, ...args: any[]): any {
  target = target || {};

  for (let sourceObject of args) {
    if (sourceObject) {
      for (let propName in sourceObject) {
        if (sourceObject.hasOwnProperty(propName) && (!isAllowed || isAllowed(propName))) {
          target[propName] = sourceObject[propName];
        }
      }
    }
  }

  return target;
}

/**
 * Takes an enum and iterates over each value of the enum (as a string), running the callback on each,
 * returning a mapped array.
 * @param theEnum - Enum to iterate over
 * @param callback - The first parameter the name of the entry, and the second parameter is the value
 * of that entry, which is the value you'd normally use when using the enum (usually a number).
 */
export function mapEnumByName<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theEnum: any,
  callback: (name?: string, value?: string | number) => T | undefined,
): (T | undefined)[] | undefined {
  // map<any> to satisfy compiler since it doesn't realize we strip out undefineds in the .filter() call
  return Object.keys(theEnum)
    .map<T | undefined>((p: string | number) => {
      // map on each property name as a string
      if (String(Number(p)) !== p) {
        // if the property is not just a number (because enums in TypeScript will map both ways)
        return callback(p as string, theEnum[p]);
      }
      return undefined;
    })
    .filter((v: T | undefined) => !!v); // only return elements with values
}

/**
 * Get all values in an object dictionary
 *
 * @param obj - The dictionary to get values for
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function values<T>(obj: any): T[] {
  return Object.keys(obj).reduce((arr: T[], key: string): T[] => {
    arr.push(obj[key]);
    return arr;
  }, []);
}

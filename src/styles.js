// @flow @format
import cssMetadata from './metadata';

import type {
  CRDP$RuleMatch,
  CRDP$CSSProperty,
} from 'devtools-typed/domain/css';

// PRECONDITION: Node is pruned.
export const getEffectiveValueForProperty = (rm: Array<CRDP$RuleMatch>) => (
  propertyName: string,
) => {
  const effectiveProperties: { [property: string]: CRDP$CSSProperty } = {};

  for (const { rule } of rm) {
    const { style } = rule;
    const { cssProperties } = style;

    if (rule.origin !== 'regular') {
      continue;
    }

    for (const property of cssProperties) {
      // Disabled properties can't be effective.
      // TODO: also check for properties without a SourceRange (logic is already in
      // background.js somewhere)
      if (property.disabled) {
        continue;
      }

      const { name } = property;
      const canonicalName = cssMetadata.canonicalPropertyName(name);
      const longhands = cssMetadata.longhandProperties(canonicalName);

      if (longhands && longhands.length > 0) {
        // Check each longhand, e.g. `margin-left`, `margin-right`, etc.
        // To see if it has an active property.
        longhands.forEach(lh => {
          if (!effectiveProperties[lh]) {
            effectiveProperties[lh] = property;
          }
        });

        // Map the shorthand to each of the longhands.
        // TODO: Check implemented??
        // TODO: This is definitely going to fail if we set a shorthand first and then subsequently overwrite with `margin-left: 10px` or something
        effectiveProperties[canonicalName] = longhands.map(
          lh => effectiveProperties[lh],
        );
      } else {
        // Property does not have longhands.
        // If the property has not yet been found, record it.
        if (!effectiveProperties[canonicalName]) {
          effectiveProperties[canonicalName] = property;
        }
      }
    }
  }

  const canonicalName = cssMetadata.canonicalPropertyName(propertyName);
  const longhands = cssMetadata.longhandProperties(canonicalName);

  const query = longhands || [canonicalName];
  const result = query.map(prop => effectiveProperties[prop]).filter(Boolean);

  return result;
};

import { ComponentStoryFn, Meta } from '@storybook/react';

type ModuleType = {
  default: Meta<any>;
} & {
  [key: string]: ComponentStoryFn<any>;
};

/**
 * Returns the Storybook module for a given package name
 */
export async function getComponentStory(
  kebabName: string,
): Promise<ModuleType | undefined> {
  try {
    return import(`@leafygreen-ui/${kebabName}/story.js`);
  } catch (err) {
    console.warn(err);
    return;
  }
}

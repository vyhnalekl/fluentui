import { FluentDesignSystemProvider } from '../design-system-provider';
import Examples from './fixtures/text-area.html';
import { FluentTextArea } from './';

// Prevent tree-shaking
FluentTextArea;
FluentDesignSystemProvider;

export default {
  title: 'Text area',
};

export const TextArea = (): string => Examples;

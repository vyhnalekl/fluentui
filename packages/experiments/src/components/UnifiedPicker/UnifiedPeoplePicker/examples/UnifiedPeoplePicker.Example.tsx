import * as React from 'react';
import {
  IFloatingSuggestionItemProps,
  IFloatingSuggestionItem,
  IFloatingPeopleSuggestionsProps,
} from '@uifabric/experiments/lib/FloatingPeopleSuggestionsComposite';
import { UnifiedPeoplePicker } from '@uifabric/experiments/lib/UnifiedPeoplePicker';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { mru, people } from '@uifabric/example-data';
import { ISelectedPeopleListProps } from '@uifabric/experiments/lib/SelectedItemsList';

const _suggestions = [
  {
    key: '1',
    id: '1',
    displayText: 'Suggestion 1',
    item: mru[0],
    isSelected: true,
    showRemoveButton: true,
  },
  {
    key: '2',
    id: '2',
    displayText: 'Suggestion 2',
    item: mru[1],
    isSelected: false,
    showRemoveButton: true,
  },
  {
    key: '3',
    id: '3',
    displayText: 'Suggestion 3',
    item: mru[2],
    isSelected: false,
    showRemoveButton: true,
  },
  {
    key: '4',
    id: '4',
    displayText: 'Suggestion 4',
    item: mru[3],
    isSelected: false,
    showRemoveButton: true,
  },
  {
    key: '5',
    id: '5',
    displayText: 'Suggestion 5',
    item: mru[4],
    isSelected: false,
    showRemoveButton: true,
  },
] as IFloatingSuggestionItem<IPersonaProps>[];

export const UnifiedPeoplePickerExample = (): JSX.Element => {
  const [peopleSuggestions, setPeopleSuggestions] = React.useState<IFloatingSuggestionItemProps<IPersonaProps>[]>([
    ..._suggestions,
  ]);

  const [peopleSelectedItems, setPeopleSelectedItems] = React.useState<IPersonaProps[]>([]);

  const _onSuggestionSelected = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    item: IFloatingSuggestionItemProps<IPersonaProps>,
  ) => {
    _markSuggestionSelected(item);
    peopleSelectedItems.push(item.item);
    setPeopleSelectedItems(peopleSelectedItems);
  };

  const _onSuggestionRemoved = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    suggestionToRemove: IFloatingSuggestionItemProps<IPersonaProps>,
  ) => {
    // Intentionally checking on complete item object to ensure it is removed. Id cannot be used as the
    // property is not populated for all the suggestions, and key does not exist on type checking.
    setPeopleSuggestions(suggestions => {
      const modifiedSuggestions = suggestions.filter(suggestion => suggestion.item !== suggestionToRemove.item);
      return modifiedSuggestions;
    });
  };

  const _markSuggestionSelected = (selectedSuggestion: IFloatingSuggestionItemProps<IPersonaProps>) => {
    setPeopleSuggestions(suggestions => {
      const modifiedSuggestions = suggestions.map(suggestion =>
        suggestion.id === selectedSuggestion.id
          ? { ...suggestion, isSelected: true }
          : { ...suggestion, isSelected: false },
      );
      return modifiedSuggestions;
    });
  };

  const _getItemsCopyText = (itemsToCopy: IPersonaProps[]): string => {
    let copyText = '';
    if (itemsToCopy && itemsToCopy.length > 0) {
      itemsToCopy.forEach(item => {
        copyText = copyText.concat((item.text || '') + ',');
      });
    }

    return copyText;
  };

  const _onPaste = (pastedValue: string, selectedItemsList: IPersonaProps[]): void => {
    // Find the suggestion corresponding to the specific text name
    // and update the selectedItemsList to re-render everything.
    const finalList: IPersonaProps[] = [];
    if (pastedValue !== null) {
      pastedValue.split(',').forEach(textValue => {
        if (textValue) {
          people.forEach(suggestionItem => {
            if (suggestionItem.text === textValue) {
              finalList.push(suggestionItem);
            }
          });
        }
      });
    }
    setPeopleSelectedItems(selectedItemsList.concat(finalList));
  };

  const _onItemsRemoved = (itemsToRemove: IPersonaProps[]): void => {
    // Updating the local copy as well at the parent level.
    const currentItems: IPersonaProps[] = [...peopleSelectedItems];
    const updatedItems: IPersonaProps[] = currentItems;
    // Intentionally not using .filter here as we want to only remove a specific
    // item in case of duplicates of same item.
    itemsToRemove.forEach(item => {
      const index: number = updatedItems.indexOf(item);
      updatedItems.splice(index, 1);
    });
    setPeopleSelectedItems(updatedItems);
  };

  const _onInputChange = (filterText: string): void => {
    const allPeople = people;
    const suggestions = allPeople.filter((item: IPersonaProps) => _startsWith(item.text || '', filterText));
    const suggestionList = suggestions.map(item => {
      return { item: item, isSelected: false, key: item.key } as IFloatingSuggestionItem<IPersonaProps>;
    });
    // We want to show top 5 results
    setPeopleSuggestions(suggestionList.splice(0, 5));
  };

  function _startsWith(text: string, filterText: string): boolean {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  const floatingPeoplePickerProps = {
    suggestions: [...peopleSuggestions],
    isSuggestionsVisible: false,
    targetElement: null,
    onSuggestionSelected: _onSuggestionSelected,
    onRemoveSuggestion: _onSuggestionRemoved,
    suggestionsHeaderText: 'People suggestions',
    noResultsFoundText: 'No suggestions',
    onFloatingSuggestionsDismiss: undefined,
    showSuggestionRemoveButton: true,
  } as IFloatingPeopleSuggestionsProps;

  const selectedPeopleListProps = {
    removeButtonAriaLabel: 'Remove',
    selectedItems: [...peopleSelectedItems],
    onItemsRemoved: _onItemsRemoved,
    getItemCopyText: _getItemsCopyText,
  } as ISelectedPeopleListProps<IPersonaProps>;

  return (
    <>
      <UnifiedPeoplePicker
        selectedItemsListProps={selectedPeopleListProps}
        floatingSuggestionProps={floatingPeoplePickerProps}
        // eslint-disable-next-line react/jsx-no-bind
        onInputChange={_onInputChange}
        // eslint-disable-next-line react/jsx-no-bind
        onPaste={_onPaste}
      />
    </>
  );
};

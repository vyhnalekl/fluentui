import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { DetailsList } from './DetailsList';
import { DetailsListBase } from './DetailsList.base';

import { IDetailsList, IColumn, DetailsListLayoutMode, CheckboxVisibility } from './DetailsList.types';
import { IDetailsColumnProps } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsColumn';
import { IDetailsHeaderProps, DetailsHeader } from './DetailsHeader';
import { EventGroup, IRenderFunction } from '../../Utilities';
import { IDragDropEvents } from './../../utilities/dragdrop/index';
import { SelectionMode, Selection, SelectionZone } from '../../utilities/selection/index';
import { getTheme } from '../../Styling';

// Populate mock data for testing
function mockData(count: number, isColumn: boolean = false, customDivider: boolean = false): any {
  const data = [];
  let _data = {};

  for (let i = 0; i < count; i++) {
    _data = {
      key: i,
      name: 'Item ' + i,
      value: i,
    };
    if (isColumn) {
      _data = {
        ..._data,
        key: `column_key_${i}`,
        ariaLabel: `column_${i}`,
        onRenderDivider: customDivider ? customColumnDivider : columnDividerWrapper,
      };
    }
    data.push(_data);
  }

  return data;
}

// Wrapper function which calls the defaultRenderer with the corresponding params
function columnDividerWrapper(
  iDetailsColumnProps: IDetailsColumnProps,
  defaultRenderer: (props?: IDetailsColumnProps) => JSX.Element | null,
): any {
  return defaultRenderer(iDetailsColumnProps);
}

// Using a bar sign as a custom divider along with the default divider
function customColumnDivider(
  iDetailsColumnProps: IDetailsColumnProps,
  defaultRenderer: (props?: IDetailsColumnProps) => JSX.Element | null,
): any {
  return (
    <React.Fragment key={`divider_${iDetailsColumnProps.columnIndex}`}>
      <span>|</span>
      {defaultRenderer(iDetailsColumnProps)}
    </React.Fragment>
  );
}

describe('DetailsList', () => {
  it('renders List correctly with onRenderDivider props', () => {
    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        columns={mockData(5, true)}
        onRenderRow={() => null}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List with custom icon as column divider', () => {
    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        columns={mockData(5, true, true)}
        onRenderRow={() => null}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List correctly', () => {
    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        onRenderRow={() => null}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List in fixed constrained layout correctly', () => {
    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        onRenderRow={() => null}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List in compact mode correctly', () => {
    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        onRenderRow={() => null}
        compact={true}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List with hidden checkboxes correctly', () => {
    const component = renderer.create(
      <DetailsList
        items={mockData(5)}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
        groups={[
          {
            key: 'group0',
            name: 'Group 0',
            startIndex: 0,
            count: 2,
          },
          {
            key: 'group1',
            name: 'Group 1',
            startIndex: 2,
            count: 3,
          },
        ]}
        checkboxVisibility={CheckboxVisibility.hidden}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('focuses row by index', () => {
    jest.useFakeTimers();

    let component: any;
    mount(
      <DetailsList
        items={mockData(5)}
        componentRef={ref => (component = ref)}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
      />,
    );

    expect(component).toBeDefined();
    (component as IDetailsList).focusIndex(2);
    setTimeout(() => {
      expect(
        (document.activeElement as HTMLElement).querySelector('[data-automationid=DetailsRowCell]')!.textContent,
      ).toEqual('2');
      expect((document.activeElement as HTMLElement).className.split(' ')).toContain('ms-DetailsRow');
    }, 0);
    jest.runOnlyPendingTimers();
  });

  it('invokes optional onRenderMissingItem prop once per missing item rendered', () => {
    const onRenderMissingItem = jest.fn();
    const items = [...mockData(5), null, null];

    mount(<DetailsList items={items} skipViewportMeasures={true} onRenderMissingItem={onRenderMissingItem} />);

    expect(onRenderMissingItem).toHaveBeenCalledTimes(2);
  });

  it('does not invoke optional onRenderMissingItem prop if no missing items are rendered', () => {
    const onRenderMissingItem = jest.fn();
    const items = mockData(5);

    mount(<DetailsList items={items} skipViewportMeasures={true} onRenderMissingItem={onRenderMissingItem} />);

    expect(onRenderMissingItem).toHaveBeenCalledTimes(0);
  });

  it('respects changed dragDropEvents prop on re-renders.', () => {
    const _dragDropEvents: IDragDropEvents = {
      canDrag: jest.fn().mockReturnValue(true),
      canDrop: jest.fn().mockReturnValue(true),
      onDragEnd: jest.fn(),
      onDragEnter: jest.fn(),
      onDragLeave: jest.fn(),
      onDragStart: jest.fn(),
      onDrop: jest.fn(),
    };

    const _dragDropEvents2: IDragDropEvents = {
      canDrag: jest.fn().mockReturnValue(true),
      canDrop: jest.fn().mockReturnValue(true),
      onDragEnd: jest.fn(),
      onDragEnter: jest.fn(),
      onDragLeave: jest.fn(),
      onDragStart: jest.fn(),
      onDrop: jest.fn(),
    };

    const _RaiseEvent = (target: any, _eventName: string, _clientX: number) => {
      EventGroup.raise(
        target,
        _eventName,
        {
          clientX: _clientX,
          button: 0,
        } as DragEvent,
        true,
      );
    };

    const container = document.createElement('div');
    const items = mockData(5);
    const columns = mockData(5, true);

    ReactDOM.render(
      <DetailsListBase columns={columns} skipViewportMeasures={true} items={items} dragDropEvents={_dragDropEvents} />,
      container,
    );

    let detailsRowSource = container.querySelector('div[aria-rowindex="2"][role="row"]') as HTMLDivElement;

    _RaiseEvent(detailsRowSource, 'mousedown', 270);
    _RaiseEvent(detailsRowSource, 'dragstart', 270);

    // original eventhandler should be fired
    expect(_dragDropEvents.onDragStart).toHaveBeenCalledTimes(1);
    expect(_dragDropEvents2.onDragStart).toHaveBeenCalledTimes(0);

    ReactDOM.render(
      <DetailsListBase columns={columns} skipViewportMeasures={true} items={items} dragDropEvents={_dragDropEvents} />,
      container,
    );

    detailsRowSource = container.querySelector('div[aria-rowindex="2"][role="row"]') as HTMLDivElement;

    _RaiseEvent(detailsRowSource, 'mousedown', 270);
    _RaiseEvent(detailsRowSource, 'dragstart', 270);

    expect(_dragDropEvents.onDragStart).toHaveBeenCalledTimes(2);
    expect(_dragDropEvents2.onDragStart).toHaveBeenCalledTimes(0);

    ReactDOM.render(
      <DetailsListBase columns={columns} skipViewportMeasures={true} items={items} dragDropEvents={_dragDropEvents2} />,
      container,
    );

    detailsRowSource = container.querySelector('div[aria-rowindex="2"][role="row"]') as HTMLDivElement;

    _RaiseEvent(detailsRowSource, 'mousedown', 270);
    _RaiseEvent(detailsRowSource, 'dragstart', 270);

    expect(_dragDropEvents.onDragStart).toHaveBeenCalledTimes(2);
    expect(_dragDropEvents2.onDragStart).toHaveBeenCalledTimes(1);
  });

  it('focuses into row element', () => {
    const onRenderColumn = (item: any, index: number, column: IColumn) => {
      let value = item && column && column.fieldName ? item[column.fieldName] : '';
      if (value === null || value === undefined) {
        value = '';
      }
      return (
        <div className={'test-column'} data-is-focusable={true}>
          {value}
        </div>
      );
    };

    const getCellValueKey = (item: any, index: number, column: IColumn) => {
      const valueKey = item && column && column.fieldName ? item[column.fieldName] : column.key + index;
      return valueKey;
    };

    jest.useFakeTimers();

    let component: any;
    mount(
      <DetailsList
        items={mockData(5)}
        componentRef={ref => (component = ref)}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
        onRenderItemColumn={onRenderColumn}
        getCellValueKey={getCellValueKey}
      />,
    );

    expect(component).toBeDefined();
    (component as IDetailsList).focusIndex(3);
    jest.runOnlyPendingTimers();
    expect(
      (document.activeElement as HTMLElement).querySelector('[data-automationid=DetailsRowCell]')!.textContent,
    ).toEqual('3');
    expect((document.activeElement as HTMLElement).className.split(' ')).toContain('ms-DetailsRow');

    // Set element visibility manually as a test workaround
    (component as IDetailsList).focusIndex(4);
    jest.runOnlyPendingTimers();
    ((document.activeElement as HTMLElement).children[1] as any).isVisible = true;
    ((document.activeElement as HTMLElement).children[1].children[0] as any).isVisible = true;
    ((document.activeElement as HTMLElement).children[1].children[0].children[0] as any).isVisible = true;

    (component as IDetailsList).focusIndex(4, true);
    jest.runOnlyPendingTimers();
    expect((document.activeElement as HTMLElement).textContent).toEqual('4');
    expect((document.activeElement as HTMLElement).className.split(' ')).toContain('test-column');
  });

  it('reset focusedItemIndex when setKey updates', () => {
    jest.useFakeTimers();

    let component: any;
    const detailsList = mount(
      <DetailsList
        items={mockData(5)}
        setKey={'key1'}
        initialFocusedIndex={0}
        componentRef={ref => (component = ref)}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
      />,
    );

    expect(component).toBeDefined();
    component.setState({ focusedItemIndex: 3 });
    setTimeout(() => {
      expect(component.state.focusedItemIndex).toEqual(3);
    }, 0);
    jest.runOnlyPendingTimers();

    // update props to new setKey
    const newProps = { items: mockData(7), setKey: 'set2', initialFocusedIndex: 0 };
    detailsList.setProps(newProps);
    detailsList.update();

    // verify that focusedItemIndex is reset to 0 and 0th row is focused
    setTimeout(() => {
      expect(component.state.focusedItemIndex).toEqual(0);
      expect(
        (document.activeElement as HTMLElement).querySelector('[data-automationid=DetailsRowCell]')!.textContent,
      ).toEqual('0');
      expect((document.activeElement as HTMLElement).className.split(' ')).toContain('ms-DetailsRow');
    }, 0);
    jest.runOnlyPendingTimers();
  });

  it('invokes optional onColumnResize callback per IColumn if defined when columns are adjusted', () => {
    const columns: IColumn[] = mockData(2, true);
    columns[0].onColumnResize = jest.fn();
    columns[1].onColumnResize = jest.fn();

    mount(<DetailsList items={mockData(2)} columns={columns} onShouldVirtualize={() => false} />);

    expect(columns[0].onColumnResize).toHaveBeenCalledTimes(1);
    expect(columns[1].onColumnResize).toHaveBeenCalledTimes(1);
  });

  it('invokes optional onRenderDetailsHeader prop to customize DetailsHeader rendering when provided', () => {
    const onRenderDetailsHeaderMock = jest.fn();

    mount(
      <DetailsList
        items={mockData(2)}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
        onRenderDetailsHeader={onRenderDetailsHeaderMock}
      />,
    );

    expect(onRenderDetailsHeaderMock).toHaveBeenCalledTimes(1);
  });

  it('invokes onRenderColumnHeaderTooltip to customize DetailsColumn tooltip rendering when provided', () => {
    const NUM_COLUMNS = 2;
    const onRenderColumnHeaderTooltipMock = jest.fn();
    const onRenderDetailsHeader = (
      props: IDetailsHeaderProps,
      defaultRenderer?: IRenderFunction<IDetailsHeaderProps>,
    ) => {
      return <DetailsHeader {...props} onRenderColumnHeaderTooltip={onRenderColumnHeaderTooltipMock} />;
    };

    mount(
      <DetailsList
        items={mockData(NUM_COLUMNS)}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
        onRenderDetailsHeader={onRenderDetailsHeader}
      />,
    );

    expect(onRenderColumnHeaderTooltipMock).toHaveBeenCalledTimes(NUM_COLUMNS);
  });

  it('invokes optional onRenderCheckbox callback to customize checkbox rendering when provided', () => {
    const onRenderCheckboxMock = jest.fn();
    const selection = new Selection();
    const theme = getTheme();
    mount(
      <DetailsList
        items={mockData(2)}
        skipViewportMeasures={true}
        onShouldVirtualize={() => false}
        onRenderCheckbox={onRenderCheckboxMock}
        checkboxVisibility={CheckboxVisibility.always}
        selectionMode={SelectionMode.multiple}
        selection={selection}
      />,
    );

    expect(onRenderCheckboxMock).toHaveBeenCalledTimes(3);
    expect(onRenderCheckboxMock.mock.calls[2][0]).toEqual({ checked: false, theme });

    selection.setAllSelected(true);

    expect(onRenderCheckboxMock).toHaveBeenCalledTimes(6);
    expect(onRenderCheckboxMock.mock.calls[5][0]).toEqual({ checked: true, theme });
  });

  it('initializes the selection mode object with the selectionMode prop', () => {
    const component = mount(
      <DetailsList items={mockData(5)} columns={mockData(5, true)} selectionMode={SelectionMode.none} />,
    );

    const selectionZone = component.find(SelectionZone);
    expect(selectionZone.props().selection.mode).toEqual(SelectionMode.none);
  });
});

import {
  getDefaultValueString,
  getInheritedProps,
  getTypeString,
  isRequired,
} from 'utils/tsdoc.utils';

import { Markdown } from 'components/Markdown';

import { css } from '@leafygreen-ui/emotion';
import ExpandableCard from '@leafygreen-ui/expandable-card';
import InlineDefinition from '@leafygreen-ui/inline-definition';
import { palette } from '@leafygreen-ui/palette';
import {
  Cell,
  HeaderCell,
  HeaderRow,
  Row,
  //   V10Cell as Cell,
  //   V10Row as Row,
  //   V10Table as Table,
  //   V10TableHeader as TableHeader,
  Table,
  TableBody,
  TableHead,
} from '@leafygreen-ui/table';
import { spacing } from '@leafygreen-ui/tokens';
import { InlineCode, Link } from '@leafygreen-ui/typography';

import { PropTooltipContent } from '../../../PropTooltipContent';

const propDefinitionTooltipStyle = css`
  min-width: min-content;
  max-width: 384px;
`;

const requiredHighlightStyle = css`
  padding-left: 1ch;
  color: ${palette.red.base};
`;

const typeCellStyle = css`
  display: inline;
  max-width: 40ch;
`;

const inheritedAttrNameStyle = css`
  &:not(:last-child) {
    &:after {
      content: ',';
      color: ${palette.black};
      margin-left: -0.25ch;
      margin-right: 1ch;
    }
  }
`;

const cellStyles = css`
  > * {
    max-height: unset !important;
  }

  // todo: remove once ui bug is fixed
  &:first-child {
    padding-left: ${spacing[4]}px;
  }

  &:last-child {
    padding-right: ${spacing[4]}px;
  }
`;

export const TSDocPropTable = ({
  tsDoc,
  className,
}: {
  tsDoc: CustomComponentDoc;
  className?: string;
}) => {
  const componentProps = getComponentPropsArray(tsDoc.props);
  const inheritedProps = getInheritedProps(tsDoc.props).filter(
    ({ groupName }) =>
      groupName.endsWith('HTMLAttributes') ||
      groupName.endsWith('SVGAttributes'),
  );

  return (
    <>
      <ExpandableCard
        title={`${tsDoc.displayName} props`}
        defaultOpen
        className={className}
      >
        <Table>
          <TableHead>
            <HeaderRow>
              <HeaderCell>Prop</HeaderCell>
              <HeaderCell>Type</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Default</HeaderCell>
            </HeaderRow>
          </TableHead>
          <TableBody>
            {componentProps.map(propItem => {
              return (
                <Row key={propItem.name}>
                  <Cell className={cellStyles}>
                    <InlineDefinition
                      tooltipClassName={propDefinitionTooltipStyle}
                      definition={<PropTooltipContent propItem={propItem} />}
                    >
                      <InlineCode>{propItem.name}</InlineCode>
                    </InlineDefinition>
                    {isRequired(propItem) && (
                      <sup className={requiredHighlightStyle}>(REQUIRED)</sup>
                    )}
                  </Cell>
                  <Cell className={cellStyles}>
                    <Markdown>{propItem.description}</Markdown>
                  </Cell>
                  <Cell className={cellStyles}>
                    <InlineCode className={typeCellStyle}>
                      {getTypeString(propItem.type)}
                    </InlineCode>
                  </Cell>
                  <Cell className={cellStyles}>
                    <InlineCode>
                      {getDefaultValueString(propItem.defaultValue) || '—'}
                    </InlineCode>
                  </Cell>
                </Row>
              );
            })}
            {inheritedProps && (
              <Row key="inherited">
                <Cell className={cellStyles}>
                  <InlineCode>...rest</InlineCode>
                </Cell>
                <Cell colSpan={3}>
                  Native attributes inherited from &nbsp;
                  {inheritedProps.map(({ groupName }) => (
                    <Link
                      key={groupName}
                      target="_blank"
                      href={getHTMLAttributesLink(groupName)}
                      className={inheritedAttrNameStyle}
                    >
                      <InlineCode>{groupName}</InlineCode>
                    </Link>
                  ))}
                </Cell>
              </Row>
            )}
          </TableBody>
        </Table>
      </ExpandableCard>
    </>
  );
};

function getHTMLAttributesLink(groupName: string) {
  switch (groupName) {
    case 'SVGAttributes':
      return 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute';
    case 'HTMLAttributes':
      return 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes';

    default: {
      let tag = groupName
        .slice(0, groupName.indexOf('HTMLAttributes'))
        .toLowerCase();

      tag = tag == 'anchor' ? 'a' : tag;
      return `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/${tag}`;
    }
  }
}

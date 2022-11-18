import ExpandableCard from '@leafygreen-ui/expandable-card';
import Callout, { Variant } from '@leafygreen-ui/callout';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import HorizontalLayout from './HorizontalLayout';
import HorizontalLayoutColumn from './HorizontalLayoutColumn';
import { useEffect, useState } from 'react';
import { getEntryById } from 'utils/getContentstackResources';
import ContentstackRichText from '.';
import { css } from '@emotion/react';

const ContentstackEntry = ({ contentTypeUid, entryUid }) => {
  const [entry, setEntry] = useState<any>();
  useEffect(() => {
    getEntryById(contentTypeUid, entryUid).then(res => {
      if (res) setEntry(res);
    });
  }, []);

  if (!entry) {
    return <>Loading embedded entry...</>;
  }

  switch (contentTypeUid) {
    case 'button_block':
      return (
        <Button variant={entry.variant} href={entry.link} css={css`margin: 0; // remove default Safari margin`}>
          {entry.content}
        </Button>
      );
    case 'callout_block':
      return (
        <Callout variant={Variant[entry.variant]}>
          <ContentstackRichText content={entry.content} />
        </Callout>
      );
    case 'card_block':
      return (
        <Card>
          <ContentstackRichText content={entry.content} />
        </Card>
      );
    case 'expandable_card_block':
      return (
        <ExpandableCard title={entry.title} description={entry.description}>
          <ContentstackRichText content={entry.content} />
        </ExpandableCard>
      );
    case 'horizontal_layout': {
      return <HorizontalLayout columns={entry.columns} />;
    }

    case 'horizontal_layout_column': {
      return <HorizontalLayoutColumn {...entry} />;
    }
    default:
      return <>Unknown reference entry: {contentTypeUid}.</>;
  }
};

export default ContentstackEntry;
